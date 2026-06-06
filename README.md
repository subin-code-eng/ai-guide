# Mysuru Heritage Guide

TanStack Start app with Lovable AI, Supabase auth, and feedback system.

---

## Running locally in VS Code

```bash
npm install
cp .env.example .env     # then edit .env and add your LOVABLE_API_KEY
npm run dev
```

Open http://localhost:8080 (or whatever port Vite prints).

### Required env vars for local dev

`.env` (already in `.gitignore`):

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
VITE_SUPABASE_PROJECT_ID=...
LOVABLE_API_KEY=...          # server-only, needed for AI features
```

- The `VITE_*` Supabase keys are public/publishable and already committed to `.env`.
- `LOVABLE_API_KEY` is **secret** — never commit it. Get it from Lovable → Project Settings → Cloud.

---

## Deploying to Vercel

This project's build is wired to support Vercel automatically via Nitro's `vercel` preset.

### One-time setup

1. Push the repo to GitHub.
2. In Vercel: **New Project → Import** the repo.
3. Framework preset: **Other** (auto-detected via `vercel.json`).
4. Build command: `NITRO_PRESET=vercel npm run build` (already in `vercel.json`).
5. Output directory: `.vercel/output` (already in `vercel.json`).
6. Add **Environment Variables** (Production + Preview + Development):

   | Name | Value |
   | --- | --- |
   | `VITE_SUPABASE_URL` | from `.env` |
   | `VITE_SUPABASE_PUBLISHABLE_KEY` | from `.env` |
   | `VITE_SUPABASE_PROJECT_ID` | from `.env` |
   | `LOVABLE_API_KEY` | from Lovable Project Settings → Cloud |
   | `NITRO_PRESET` | `vercel` |

7. Deploy.

### How it works

- `vite.config.ts` detects `VERCEL=1` or `NITRO_PRESET=vercel` and switches the Nitro preset from `cloudflare-module` to `vercel`.
- Nitro emits `.vercel/output/` directly — Vercel serves the SSR function and static assets natively. No further config needed.
- TanStack Start server routes (`/api/ai-assistant`) become Vercel serverless functions automatically.

### Supabase configuration

In your Supabase dashboard, add your Vercel domains to:
- **Authentication → URL Configuration → Site URL** and **Redirect URLs**:
  - `https://your-app.vercel.app`
  - `https://your-app.vercel.app/**`
  - Any custom domain you attach later.

Otherwise email confirmation links will bounce back to localhost.

---

## Troubleshooting

**AI features return 500 / "LOVABLE_API_KEY not configured"**
→ Add `LOVABLE_API_KEY` in Vercel env vars (and locally in `.env`), then redeploy.

**Auth redirects to localhost after sign-in**
→ Update Supabase Site URL + Redirect URLs (see above).

**404 on refresh of `/auth`, `/register-artisan`, etc.**
→ Should not happen with the Nitro vercel preset. If it does, confirm `vercel.json` is present and `outputDirectory` is `.vercel/output`.

**Build fails with `nitro` not found**
→ `nitro` is already in `devDependencies`. Run `npm install` again.
