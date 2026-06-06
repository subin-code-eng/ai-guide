import { createFileRoute } from "@tanstack/react-router";

// Direct Google Gemini API integration.
// Set GEMINI_API_KEY as a server secret. Get a key at https://aistudio.google.com/apikey
const MODEL = "gemini-2.5-flash-lite";
const BASE = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}`;

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

type ChatMsg = { role: "user" | "assistant" | "system"; content: string };

function toGeminiContents(messages: ChatMsg[]) {
  return messages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));
}

function getKey() {
  const k = process.env.GEMINI_API_KEY;
  if (!k) throw new Error("GEMINI_API_KEY not configured");
  return k;
}

async function geminiGenerate(systemText: string, messages: ChatMsg[]) {
  const body = {
    system_instruction: { parts: [{ text: systemText }] },
    contents: toGeminiContents(messages),
  };
  const r = await fetch(`${BASE}:generateContent?key=${getKey()}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Response(t, { status: r.status });
  }
  const d = await r.json();
  const text =
    d.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("") ?? "";
  return text;
}

async function geminiStream(systemText: string, messages: ChatMsg[]) {
  const body = {
    system_instruction: { parts: [{ text: systemText }] },
    contents: toGeminiContents(messages),
  };
  return await fetch(`${BASE}:streamGenerateContent?alt=sse&key=${getKey()}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// Translate Gemini SSE stream to OpenAI-style delta SSE that the client expects.
function geminiToOpenAIStream(geminiBody: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const reader = geminiBody.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  return new ReadableStream({
    async pull(controller) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
          return;
        }
        buffer += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, nl);
          buffer = buffer.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (!payload) continue;
          try {
            const parsed = JSON.parse(payload);
            const text =
              parsed.candidates?.[0]?.content?.parts
                ?.map((p: any) => p.text)
                .join("") ?? "";
            if (text) {
              const out = { choices: [{ delta: { content: text } }] };
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(out)}\n\n`));
            }
          } catch {
            // partial JSON line, put back
            buffer = line + "\n" + buffer;
            return;
          }
        }
        return; // yield back to consumer
      }
    },
    cancel() {
      reader.cancel().catch(() => {});
    },
  });
}

function extractJson(text: string): any {
  const cleaned = text.replace(/```json\s*/gi, "").replace(/```/g, "").trim();
  const m = cleaned.match(/[\{\[][\s\S]*[\}\]]/);
  if (!m) return null;
  try {
    return JSON.parse(m[0]);
  } catch {
    return null;
  }
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
            const system = `You are the Mysuru Heritage Guide — a warm, deeply knowledgeable local expert. Be open and generous: reveal ALL the hidden gems, secret spots, lesser-known artisans, off-the-tourist-trail experiences, quiet alternatives, best timings, local rituals, and insider tips. Never hold back information. Ground answers in CONTEXT but enrich them with rich Mysuru cultural knowledge. Use markdown.\n\nCONTEXT:\n${payload.context ?? ""}`;
            const r = await geminiStream(system, payload.messages);
            if (!r.ok || !r.body) {
              const t = await r.text();
              return new Response(t, { status: r.status, headers: corsHeaders });
            }
            const stream = geminiToOpenAIStream(r.body);
            return new Response(stream, {
              status: 200,
              headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
            });
          }

          if (mode === "recommend") {
            const prompt = `Hour ${payload.hour} in Mysuru. CROWDED now: ${(payload.highCrowdNames || []).join(", ") || "none"}.\n\nQuieter alternatives:\n${payload.alternatives}\n\nRecommend ONE place to visit right now. 2-3 sentences. Markdown with **bold** place name.`;
            const text = await geminiGenerate(
              "Savvy local Mysuru guide helping visitors avoid crowds.",
              [{ role: "user", content: prompt }],
            );
            return json({ result: text });
          }

          if (mode === "search") {
            const prompt = `Query: "${payload.query}"\n\nPLACES (id|name|category|description):\n${payload.places}\n\nARTISANS (id|name|craft|specialty|location):\n${payload.artisans}\n\nReturn ONLY JSON: {"place_ids":[...],"artisan_ids":[...],"explanation":"one sentence"}`;
            const text = await geminiGenerate(
              "Match queries to Mysuru places/artisans. Return strict JSON only.",
              [{ role: "user", content: prompt }],
            );
            const parsed = extractJson(text) ?? {
              place_ids: [],
              artisan_ids: [],
              explanation: text,
            };
            return json(parsed);
          }

          if (mode === "generate_trail") {
            const prompt = `Build a personalized Mysuru trail. Include hidden gems freely.\nInterests: ${payload.interests}\nHours: ${payload.hours}\n\nPLACES:\n${payload.places}\n\nARTISANS:\n${payload.artisans}\n\nReturn ONLY JSON:\n{"name":"...","tagline":"...","narrative":"markdown 3-5 short paras","place_ids":[...],"artisan_ids":[...],"estimated_duration":"e.g. 3 hours"}`;
            const text = await geminiGenerate(
              "Master storyteller crafting Mysuru heritage trails. Strict JSON only.",
              [{ role: "user", content: prompt }],
            );
            const parsed = extractJson(text);
            if (!parsed) return json({ error: "parse_failed", raw: text }, 500);
            return json(parsed);
          }

          if (mode === "storyteller") {
            const prompt = `Re-narrate this trail as an evocative short story (markdown, 3 paragraphs).\n\nItems:\n${(payload.items || [])
              .map((i: any) => `- ${i.name} (${i.type}): ${i.description}`)
              .join("\n")}`;
            const text = await geminiGenerate(
              "Poetic Mysuru storyteller. Sensory, historically grounded prose.",
              [{ role: "user", content: prompt }],
            );
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
