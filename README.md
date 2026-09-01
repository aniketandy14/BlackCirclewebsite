# Black Circle — pitch site

Marketing and pitch site for **Black Circle**, an open-world crime thriller by
Aniket Shintre. Next.js 15 (App Router) + TypeScript + Tailwind CSS v4,
deployed on Vercel.

## What is here

| Route              | What it does                                              |
| ------------------ | --------------------------------------------------------- |
| `/`                | The pitch site — product, gameplay, roadmap, download        |
| `/admin`           | Password-protected page for uploading the downloadable zip  |
| `/api/download`    | Stable public link that redirects to the newest build       |
| `/api/blob/upload` | Issues client-upload tokens (checks the admin password)     |
| `/api/builds`      | Lists and deletes builds (admin only)                       |

The download button always points at `/api/download`. That route resolves the
most recently uploaded zip in Vercel Blob at request time and serves it as a
file download, so the link never goes stale. Until a build is uploaded the
button is inert and reads "Build coming soon" — it never sends visitors
elsewhere.

## Setting up the download (one time)

The upload feature needs two things configured in Vercel.

**1. Create a Blob store**

In the Vercel dashboard: your project → **Storage** → **Create Database** →
**Blob** → **Continue**. Connect it to this project. Vercel adds the
`BLOB_READ_WRITE_TOKEN` environment variable automatically.

**2. Set an admin password**

Project → **Settings** → **Environment Variables**. Add:

```
ADMIN_PASSWORD = <whatever password you want>
```

Apply it to Production, Preview and Development, then **redeploy** so the new
variables are picked up.

**3. Upload a build**

Go to `https://<your-site>/admin`, enter the password, and drop in a `.zip`.
The newest upload becomes the live download immediately — no redeploy needed.
Old builds stay listed on the admin page so you can delete them when you want.

Uploads go straight from the browser to Blob storage in parallel chunks, so
large builds are fine (capped at 5 GB).

## Local development

Requires Node.js 18.18+ (20 LTS recommended).

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

For the admin page to work locally, copy `.env.example` to `.env.local` and
fill in both values. You can pull the real Blob token with
`npx vercel env pull .env.local` once the project is linked. Without them the
site still runs — the download button just shows its "Build coming soon" state.

## Structure

```
app/
  page.tsx              the pitch site
  layout.tsx            root layout + metadata
  globals.css           theme tokens
  admin/page.tsx        build upload UI
  api/
    blob/upload/route.ts  client-upload token issuer
    builds/route.ts       list + delete builds
    download/route.ts     public download redirect
lib/
  blob.ts               Blob queries and formatting helpers
```
