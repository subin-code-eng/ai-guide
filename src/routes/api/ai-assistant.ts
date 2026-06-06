import { createFileRoute } from "@tanstack/react-router";

// OpenRouter — OpenAI-compatible gateway. Works on Lovable AND Vercel.
// Get a key at https://openrouter.ai/keys and set OPENROUTER_API_KEY.
const GATEWAY_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "google/gemini-2.5-flash";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function callGateway(messages: any[], stream = false) {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY not configured");
  return await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://mysuru-heritage.lovable.app",
      "X-Title": "Mysuru Heritage Guide",
    },
    body: JSON.stringify({ model: MODEL, stream, messages }),
  });
}

async function nonStreamText(messages: any[]): Promise<string> {
  const r = await callGateway(messages, false);
  if (!r.ok) {
    const t = await r.text();
    throw new Response(t, { status: r.status });
  }
  const d = await r.json();
  return d.choices?.[0]?.message?.content ?? "";
}

function extractJson(text: string): any {
  const cleaned = text.replace(/```json\s*/gi, "").replace(/```/g, "").trim();
  const m = cleaned.match(/[\{\[][\s\S]*[\}\]]/);
  if (!m) return null;
  try { return JSON.parse(m[0]); } catch { return null; }
}

export const Route = createFileRoute("/api/ai-assistant")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { headers: corsHeaders }),
      POST: async ({ request }) => {
        try {
          const payload = await request.json();
          const mode = payload.mode;

          if (mode === "chat") {
            const system = `You are the Mysuru Heritage Guide — warm, concise, knowledgeable about Mysuru's hidden gems, master artisans, and quiet alternatives to crowded places. Ground answers in CONTEXT. If asked about something outside context, say so and suggest a related option.\n\nCONTEXT:\n${payload.context ?? ""}`;
            const messages = [{ role: "system", content: system }, ...payload.messages];
            const r = await callGateway(messages, true);
            if (!r.ok) {
              const t = await r.text();
              return new Response(t, { status: r.status, headers: corsHeaders });
            }
            return new Response(r.body, {
              status: 200,
              headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
            });
          }

          if (mode === "recommend") {
            const prompt = `Hour ${payload.hour} in Mysuru. CROWDED now: ${(payload.highCrowdNames || []).join(", ") || "none"}.\n\nQuieter alternatives:\n${payload.alternatives}\n\nRecommend ONE place to visit right now. 2-3 sentences. Markdown with **bold** place name.`;
            const text = await nonStreamText([
              { role: "system", content: "Savvy local Mysuru guide helping visitors avoid crowds." },
              { role: "user", content: prompt },
            ]);
            return json({ result: text });
          }

          if (mode === "search") {
            const prompt = `Query: "${payload.query}"\n\nPLACES (id|name|category|description):\n${payload.places}\n\nARTISANS (id|name|craft|specialty|location):\n${payload.artisans}\n\nReturn ONLY JSON: {"place_ids":[...],"artisan_ids":[...],"explanation":"one sentence"}`;
            const text = await nonStreamText([
              { role: "system", content: "Match queries to Mysuru places/artisans. Return strict JSON only." },
              { role: "user", content: prompt },
            ]);
            const parsed = extractJson(text) ?? { place_ids: [], artisan_ids: [], explanation: text };
            return json(parsed);
          }

          if (mode === "generate_trail") {
            const prompt = `Build a personalized Mysuru trail.\nInterests: ${payload.interests}\nHours: ${payload.hours}\n\nPLACES:\n${payload.places}\n\nARTISANS:\n${payload.artisans}\n\nReturn ONLY JSON:\n{"name":"...","tagline":"...","narrative":"markdown 3-5 short paras","place_ids":[...],"artisan_ids":[...],"estimated_duration":"e.g. 3 hours"}`;
            const text = await nonStreamText([
              { role: "system", content: "Master storyteller crafting Mysuru heritage trails. Strict JSON only." },
              { role: "user", content: prompt },
            ]);
            const parsed = extractJson(text);
            if (!parsed) return json({ error: "parse_failed", raw: text }, 500);
            return json(parsed);
          }

          if (mode === "storyteller") {
            const prompt = `Re-narrate this trail as an evocative short story (markdown, 3 paragraphs).\n\nItems:\n${(payload.items || []).map((i: any) => `- ${i.name} (${i.type}): ${i.description}`).join("\n")}`;
            const text = await nonStreamText([
              { role: "system", content: "Poetic Mysuru storyteller. Sensory, historically grounded prose." },
              { role: "user", content: prompt },
            ]);
            return json({ result: text });
          }

          return json({ error: "unknown mode" }, 400);
        } catch (e: any) {
          if (e instanceof Response) {
            const body = await e.text().catch(() => "");
            return new Response(body || JSON.stringify({ error: "gateway_error" }), {
              status: e.status,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
          console.error("ai-assistant error:", e);
          return json({ error: e?.message ?? "internal_error" }, 500);
        }
      },
    },
  },
});
