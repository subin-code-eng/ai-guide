// Supabase Edge Function: ai-assistant
// Routes multiple AI modes through Lovable AI Gateway.
// Modes: chat (stream), recommend, search, generate_trail, storyteller

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-2.5-flash";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function callGateway(body: unknown, stream = false) {
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");
  return await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: MODEL, stream, ...(body as object) }),
  });
}

function extractJson(text: string): any {
  // Strip code fences and find first JSON object/array
  const cleaned = text.replace(/```json\s*/gi, "").replace(/```/g, "").trim();
  const match = cleaned.match(/[\{\[][\s\S]*[\}\]]/);
  if (!match) return null;
  try { return JSON.parse(match[0]); } catch { return null; }
}

async function nonStreamText(messages: any[]): Promise<string> {
  const resp = await callGateway({ messages }, false);
  if (!resp.ok) {
    const t = await resp.text();
    throw new Response(t, { status: resp.status });
  }
  const data = await resp.json();
  return data.choices?.[0]?.message?.content ?? "";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const payload = await req.json();
    const mode = payload.mode;

    if (mode === "chat") {
      const system = `You are the Mysuru Heritage Guide — warm, concise, and knowledgeable about Mysuru's hidden gems, master artisans, and quiet alternatives to crowded places. Use the provided CONTEXT to ground answers. If asked about something not in context, say so politely and suggest a related option from context.\n\nCONTEXT:\n${payload.context ?? ""}`;
      const messages = [{ role: "system", content: system }, ...payload.messages];
      const resp = await callGateway({ messages }, true);
      if (!resp.ok) {
        const t = await resp.text();
        return new Response(t, { status: resp.status, headers: corsHeaders });
      }
      return new Response(resp.body, {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    if (mode === "recommend") {
      const prompt = `It is hour ${payload.hour} in Mysuru. These spots are CROWDED right now: ${(payload.highCrowdNames || []).join(", ") || "none"}.\n\nQuieter alternatives:\n${payload.alternatives}\n\nRecommend ONE specific place to visit right now and explain in 2-3 sentences why it's a perfect pick given time of day and crowds. Use markdown with a bold place name.`;
      const text = await nonStreamText([
        { role: "system", content: "You are a savvy local Mysuru guide who helps visitors avoid crowds." },
        { role: "user", content: prompt },
      ]);
      return jsonResponse({ result: text });
    }

    if (mode === "search") {
      const prompt = `User query: "${payload.query}"\n\nPLACES (id|name|category|description):\n${payload.places}\n\nARTISANS (id|name|craft|specialty|location):\n${payload.artisans}\n\nReturn ONLY JSON: {"place_ids": [...], "artisan_ids": [...], "explanation": "one sentence why these match"}`;
      const text = await nonStreamText([
        { role: "system", content: "You match user queries to Mysuru heritage places and artisans. Return strict JSON only." },
        { role: "user", content: prompt },
      ]);
      const json = extractJson(text) ?? { place_ids: [], artisan_ids: [], explanation: text };
      return jsonResponse(json);
    }

    if (mode === "generate_trail") {
      const prompt = `Build a personalized Mysuru cultural trail for a visitor.\nInterests: ${payload.interests}\nAvailable hours: ${payload.hours}\n\nPLACES (id|name|category|description):\n${payload.places}\n\nARTISANS (id|name|craft|specialty):\n${payload.artisans}\n\nReturn ONLY JSON:\n{"name":"...","tagline":"...","narrative":"markdown story 3-5 short paras","place_ids":["..."],"artisan_ids":["..."],"estimated_duration":"e.g. 3 hours"}`;
      const text = await nonStreamText([
        { role: "system", content: "You are a master storyteller crafting bespoke Mysuru heritage trails. Return strict JSON only." },
        { role: "user", content: prompt },
      ]);
      const json = extractJson(text);
      if (!json) return jsonResponse({ error: "parse_failed", raw: text }, 500);
      return jsonResponse(json);
    }

    if (mode === "storyteller") {
      const prompt = `Re-narrate this trail as an evocative short story (markdown, 3 paragraphs).\n\nItems:\n${(payload.items || []).map((i: any) => `- ${i.name} (${i.type}): ${i.description}`).join("\n")}`;
      const text = await nonStreamText([
        { role: "system", content: "You are a poetic Mysuru storyteller. Weave sensory, historically grounded prose." },
        { role: "user", content: prompt },
      ]);
      return jsonResponse({ result: text });
    }

    return jsonResponse({ error: "unknown mode" }, 400);
  } catch (e: any) {
    if (e instanceof Response) {
      const status = e.status;
      const body = await e.text().catch(() => "");
      return new Response(body || JSON.stringify({ error: "gateway_error" }), {
        status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    console.error("ai-assistant error:", e);
    return jsonResponse({ error: e?.message ?? "internal_error" }, 500);
  }
});
