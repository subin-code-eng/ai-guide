import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Detect Vercel build environment — switch nitro preset to Vercel.
// On Lovable / Cloudflare, default behaviour (cloudflare-module) is preserved.
const isVercel = !!process.env.VERCEL || process.env.NITRO_PRESET === "vercel";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  // Force-enable nitro with the Vercel preset when building on Vercel.
  // (Outside Lovable sandboxes, nitro is skipped by default unless explicit.)
  ...(isVercel
    ? { nitro: { preset: "vercel" } as { preset: "vercel" } }
    : {}),
});
