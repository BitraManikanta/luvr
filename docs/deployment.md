# Luvora – Deployment Guide

## Website (Vercel)

### Step-by-step: Deploy the website for the first time

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "feat: Phase 1 & 2 – Luvora monorepo"
   # Create a repo at github.com, then:
   git remote add origin https://github.com/YOUR_USERNAME/luvora.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in (free account is sufficient)
   - Click **Add New → Project**
   - Import your GitHub repository
   - Vercel will detect Next.js automatically

3. **Configure build settings**
   In Vercel's project settings, set:
   - **Root Directory:** `apps/web`
   - **Build Command:** `cd ../.. && yarn workspace @luvora/web build`
   - **Output Directory:** `.next`
   - **Install Command:** `cd ../.. && yarn install`

   Or leave defaults if using the `vercel.json` already in `apps/web/`.

4. **Deploy**
   Click Deploy. The first build takes ~2–3 minutes.
   Vercel will provide a URL like `luvora-abc123.vercel.app`.

5. **Verify**
   - Open the Vercel URL in a browser
   - Check the landing page loads
   - Test the waitlist form submits without errors
   - Check `/privacy` and `/terms` pages

### Custom Domain (after purchase)

Once you own `luvora.app` (or your chosen domain):

1. In Vercel project → Settings → Domains → Add Domain → type `luvora.app`
2. Vercel shows the DNS records to add (either A record or CNAME)
3. At your registrar's DNS panel, add those records
4. Vercel automatically provisions HTTPS via Let's Encrypt
5. Wait up to 48 hours for DNS propagation (usually <30 minutes)
6. Verify: `https://luvora.app` loads with a green padlock

Also add `www.luvora.app` as a redirect to `luvora.app` in Vercel.

---

## API Backend (Production)

Production backend deployment is Phase 12. For now, use Docker Compose locally:

```bash
docker compose -f infrastructure/docker-compose.yml up -d
cd apps/api
cp .env.example .env.local
# Set strong secrets for JWT_SECRET and JWT_REFRESH_SECRET
yarn start:dev
```

Health check: `GET http://localhost:3001/api/v1/health`

---

## Environment Variables Reference

### Website (`apps/web`)

No required env vars for the public website currently.
Future: `NEXT_PUBLIC_API_URL` for client-side API calls.

### API (`apps/api`)

See `apps/api/.env.example` for the complete list.
**Critical:** Generate strong random values for `JWT_SECRET` and `JWT_REFRESH_SECRET`.

```bash
# Generate a secure secret (run in any terminal):
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## DNS Configuration Template

After purchasing your domain, configure these records:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | (Vercel IP from dashboard) | 3600 |
| CNAME | www | cname.vercel-dns.com | 3600 |
| CNAME | api | (your API hosting CNAME) | 3600 |
| TXT | @ | (Vercel verification token) | 3600 |
| MX | @ | (email provider records) | 3600 |

---

## Mobile (EAS Build) — Phase 12

```bash
# Install EAS CLI
npm install -g eas-cli

# Log in to Expo
eas login

# Configure
cd apps/mobile
eas build:configure

# Android build
eas build --platform android --profile production

# iOS build  
eas build --platform ios --profile production
```

Requires:
- Expo account (free)
- Apple Developer Program ($99/year) for iOS
- Google Play Console ($25 one-time) for Android
