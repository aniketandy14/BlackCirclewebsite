# pitch-site

Next.js 15 (App Router) + TypeScript + Tailwind CSS v4. Built to deploy on Vercel.

## Local development

Requires Node.js 18.18+ (20 LTS recommended) — not currently installed on this
machine. Get it from https://nodejs.org.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Deploying to Vercel

**With Git (recommended):** push this folder to a GitHub repo, then import it at
https://vercel.com/new. Vercel detects Next.js, runs `npm install && npm run build`,
and redeploys on every push.

**Without Git:** `npm i -g vercel && vercel` from this directory.

No environment variables or build settings are needed as of now.

## Structure

```
app/
  layout.tsx     root layout + metadata
  page.tsx       home page
  globals.css    Tailwind import + theme tokens
```
