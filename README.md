# 💌 Luvr

**Where love lives, grows, and shines.**

Luvr is a privacy-first messaging and social application for couples and the people they love.

> Developed by **BITRA MANIKANTA** · GitHub: [@BitraManikanta](https://github.com/BitraManikanta)

---

## 🌐 Live Website

**Public URL:** Deploy via Vercel → connect `BitraManikanta/luvr` (private repo, public site).

See [docs/deployment.md](docs/deployment.md) for step-by-step instructions.

---

## ✨ Features

| Feature | Status |
|---------|--------|
| 🌸 Beautiful landing website | ✅ Live |
| 💌 Waitlist signup | ✅ Live |
| 🔒 End-to-end encrypted messaging (Signal Protocol) | 🔧 Phase 4 |
| 💬 Rich messaging (emoji, stickers, GIFs, voice) | 🔧 Phase 3+ |
| 🎮 15+ couple games inside chat | 🔧 Phase 6 |
| 💕 Couple Space (anniversaries, memories, letters) | 🔧 Phase 6 |
| 🌸 Stories, social feed & reels | 🔧 Phase 7–8 |
| 🎨 12 free beautiful themes | ✅ Design system ready |
| 📞 Audio & video calls (WebRTC) | 🔧 Phase 10 |
| 🤖 Private AI companion | 🔧 Phase 9 |
| 📴 Offline messaging with auto-retry | ✅ Architecture ready |
| 🔑 Device key management | ✅ API scaffold ready |

---

## 🏗 Repository Structure

```
luvr/
├── apps/
│   ├── mobile/       React Native + Expo (iOS & Android)
│   ├── web/          Next.js public website (Vercel)
│   └── api/          NestJS backend (Node.js + PostgreSQL)
├── packages/
│   ├── shared-types/          TypeScript types
│   ├── design-system/         Theme engine + 12 themes
│   ├── cryptography-adapter/  E2E encryption (Signal Protocol)
│   └── ...
├── infrastructure/
│   └── docker-compose.yml     Local dev: PostgreSQL, Redis, MinIO
└── docs/
    ├── architecture.md
    ├── threat-model.md
    ├── privacy-model.md
    └── deployment.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Yarn 4 (`corepack enable`)
- Docker Desktop

### 1. Install dependencies
```bash
yarn install
```

### 2. Start local services (database, cache, storage)
```bash
docker compose -f infrastructure/docker-compose.yml up -d
```

### 3. Configure API environment
```bash
cd apps/api
cp .env.example .env.local
# Edit .env.local — set strong JWT_SECRET and JWT_REFRESH_SECRET values
```

### 4. Start the API
```bash
yarn workspace @luvora/api start:dev
# → http://localhost:3001/api/v1/health
```

### 5. Start the website
```bash
yarn workspace @luvora/web dev
# → http://localhost:3000
```

### 6. Start the mobile app
```bash
yarn workspace @luvora/mobile start
# Press 'a' Android · 'i' iOS · scan QR with Expo Go
```

---

## 🔐 Environment Variables

Copy `apps/api/.env.example` to `apps/api/.env.local` and fill in:

| Variable | Description |
|----------|-------------|
| `JWT_SECRET` | Strong random string (≥ 64 chars) |
| `JWT_REFRESH_SECRET` | Different strong random string |
| `DB_PASSWORD` | PostgreSQL password |
| `S3_SECRET_KEY` | MinIO / S3 secret |

Generate a secret: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

**Never commit `.env.local` or any file with real secrets.**

---

## 🌍 Deployment

The website deploys to Vercel from the private GitHub repository.

The source code remains private. Only the compiled website is public.

See [docs/deployment.md](docs/deployment.md) for the full guide.

---

## 🔒 Security

- End-to-end encryption planned via Signal Protocol (Phase 4)
- Passwords hashed with bcrypt (cost factor 12)
- JWT tokens with short expiry + secure refresh
- API rate limiting with `@nestjs/throttler`
- All secrets in environment variables only
- See [docs/threat-model.md](docs/threat-model.md) for the full model

---

## 📋 Build Phases

| Phase | Status | Description |
|-------|--------|-------------|
| 1 | ✅ | Brand, design system, monorepo scaffold |
| 2 | ✅ | Website + Vercel deployment |
| 3 | ✅ | Auth, database, real-time messaging |
| 4 | 🔧 | E2E encryption (Signal Protocol) |
| 5 | 🔧 | Offline queues + encrypted media |
| 6 | 🔧 | Themes + couple games |
| 7 | 🔧 | Profiles, stories, social feed |
| 8 | 🔧 | Short-form video (reels) |
| 9 | 🔧 | Hybrid AI companion |
| 10 | 🔧 | Audio + video calling |
| 11 | 🔧 | Security hardening + independent review |
| 12 | 🔧 | Custom domain + app store release |

---

## 👨‍💻 Developer

**Developed by BITRA MANIKANTA**

GitHub: [@BitraManikanta](https://github.com/BitraManikanta)

---

## 📄 License

Private — all rights reserved. License to be determined before public release.
