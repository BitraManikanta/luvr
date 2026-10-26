# Luvr – Deployment Guide

> Developed by **BITRA MANIKANTA**

## Architecture

```
Private GitHub repo (BitraManikanta/luvr)
         │
         │ authorized Git integration
         ▼
    Vercel (free hobby plan)
         │
         │ builds Next.js app, hosts compiled output
         ▼
  Public HTTPS website (luvr-*.vercel.app)
         │
         │ HTTPS for all users
         ▼
    Users worldwide
```

Your source code stays private. Only the compiled website is public.

---

## Step 1 — Deploy to Vercel (Free)

Vercel's free Hobby plan supports:
- Private GitHub repositories ✅
- Next.js (official framework) ✅
- Unlimited personal projects ✅
- Automatic HTTPS ✅
- Global CDN ✅

### Instructions

1. Go to **[vercel.com](https://vercel.com)** and sign in to your account `mani98vb-1367`

2. Click **Add New → Project**

3. Click **Import Git Repository**
   - If not already connected, click **Add GitHub Account** and authorize Vercel to access private repos
   - Select `BitraManikanta/luvr`

4. **Configure the project settings:**

   | Setting | Value |
   |---------|-------|
   | Framework Preset | **Next.js** |
   | Root Directory | **(leave blank — use monorepo root)** |
   | Build Command | `yarn workspace @luvora/web build` |
   | Output Directory | `apps/web/.next` |
   | Install Command | `yarn install --frozen-lockfile` |

5. **Add Environment Variables** (click "Environment Variables" section):

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_SITE_URL` | `https://YOUR-PROJECT.vercel.app` (fill in after first deploy) |

6. Click **Deploy**

7. Wait ~2 minutes for the build to complete

8. Click the generated URL (e.g. `https://luvr-xyz.vercel.app`) — your site is live!

---

## Step 2 — Update NEXT_PUBLIC_SITE_URL

After your first deploy:

1. Copy your real Vercel URL (e.g. `https://luvr-abc123.vercel.app`)
2. In Vercel: **Project Settings → Environment Variables**
3. Set `NEXT_PUBLIC_SITE_URL` = your real URL
4. Click **Save** and then **Redeploy**

This fixes canonical URLs, sitemap, robots.txt, and OG image to point to your real domain.

---

## Step 3 — Verify the deployment

Check these URLs after deployment:

| URL | Expected |
|-----|----------|
| `https://YOUR-URL/` | Landing page loads |
| `https://YOUR-URL/about` | About page with BITRA MANIKANTA credit |
| `https://YOUR-URL/privacy` | Privacy policy |
| `https://YOUR-URL/terms` | Terms of service |
| `https://YOUR-URL/security` | Security disclosure |
| `https://YOUR-URL/support` | Support FAQ |
| `https://YOUR-URL/sitemap.xml` | XML sitemap |
| `https://YOUR-URL/robots.txt` | Robots file |
| `https://YOUR-URL/site.webmanifest` | Web app manifest |
| `https://YOUR-URL/api/waitlist` (POST) | 200 on valid email |

---

## Step 4 — Google Search Console

1. Go to **[search.google.com/search-console](https://search.google.com/search-console)**
2. Click **Add Property** → **URL prefix** → enter your Vercel URL
3. Choose **HTML tag** verification:
   - Copy the content value from the `<meta name="google-site-verification">` tag
   - Add it as an env var: `NEXT_PUBLIC_GOOGLE_VERIFICATION` = that value
   - Add `verification: { google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION }` to the `metadata` object in `apps/web/app/layout.tsx`
4. Click **Verify**
5. Go to **Sitemaps** → enter `sitemap.xml` → **Submit**
6. Use **URL Inspection** on your homepage → **Request Indexing**

Note: Google indexing typically takes 1–14 days after submission.

---

## Step 5 — Custom Domain (future, when you're ready)

Do not buy a domain yet.

**Recommended future domains to check:**

| Domain | Est. Registration | Est. Renewal | Registrar |
|--------|-------------------|--------------|-----------|
| luvr.app | ~$15–20/yr | ~$15–20/yr | Google Domains / Cloudflare |
| getluvr.com | ~$10–15/yr | ~$10–15/yr | Cloudflare Registrar |
| luvr.co | ~$25–30/yr | ~$25–30/yr | Namecheap |
| luvrapp.com | ~$10–15/yr | ~$10–15/yr | Cloudflare Registrar |
| luvr.io | ~$30–40/yr | ~$30–40/yr | Namecheap |

> ⚠️ Check domain availability at [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/) (no markup on most domains) before purchasing.
> I will not purchase any domain without your explicit approval.

**Once you purchase a domain:**

1. In Vercel: **Project Settings → Domains → Add**
2. Enter your domain (e.g. `luvr.app`)
3. Vercel shows DNS records to add
4. Add those records at your registrar's DNS panel
5. Vercel automatically provisions HTTPS (Let's Encrypt)
6. Update `NEXT_PUBLIC_SITE_URL` in Vercel to `https://luvr.app`
7. Redeploy

---

## API Backend (Local / Future Production)

The API backend is not yet deployed to production. For local development:

```bash
docker compose -f infrastructure/docker-compose.yml up -d
cd apps/api
cp .env.example .env.local
# Set JWT_SECRET and JWT_REFRESH_SECRET to strong random strings
yarn workspace @luvora/api start:dev
# → http://localhost:3001/api/v1/health
```

Production API deployment options (free tiers):
- **Railway** — 5 USD/month credit free tier, supports Node.js + PostgreSQL
- **Render** — free tier for Node.js services (sleeps after 15 min inactivity)
- **Fly.io** — 3 free shared VMs, supports Docker

The API deployment is planned for Phase 3 production release.
