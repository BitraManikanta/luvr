# 💌 Luvora

**Where love lives, grows, and shines.**

Luvora is a privacy-first messaging and social application for couples and the people they love.

> 🚧 **Currently in active development** — Phase 1 (brand, architecture, design system, mobile MVP)

---

## Features (Planned)

- 🔒 **End-to-end encrypted** one-to-one and group messaging (Signal Protocol – Phase 4)
- 💬 Rich messaging — emoji, stickers, GIFs, voice messages, reactions, disappearing messages
- 🎮 **15+ couple games** playable inside chat
- 💕 **Couple Space** — anniversaries, memories, love letters, mood check-ins, bucket lists
- 🌸 Stories, social feed, followers, and reels
- 🎨 **12 beautiful themes** — all free, fully customizable
- 📞 Audio and video calls (WebRTC)
- 🤖 Private-first AI companion (on-device + opt-in cloud)
- 📴 **Full offline support** with encrypted outbox
- 🔑 Secure device management with platform Keychain/Keystore integration

---

## Monorepo Structure

```
luvora/
├── apps/
│   ├── mobile/       React Native + Expo (iOS & Android)
│   ├── web/          Next.js public website
│   └── api/          NestJS backend
├── packages/
│   ├── shared-types/         TypeScript types
│   ├── design-system/        Theme engine + components
│   ├── contracts/            API schemas (Zod)
│   ├── cryptography-adapter/ E2E encryption (Phase 4)
│   └── test-fixtures/        Test helpers
├── infrastructure/
│   ├── docker-compose.yml    Local dev services
│   └── database/             Migrations + seeds
└── docs/
    ├── architecture.md
    ├── threat-model.md
    └── privacy-model.md
```

---

## Development Setup

### Prerequisites

- Node.js 20+
- Yarn 4 (Corepack)
- Docker Desktop (for PostgreSQL, Redis, MinIO)
- Expo Go or a physical device for mobile development

### 1. Install dependencies

```bash
corepack enable
yarn install
```

### 2. Start local services

```bash
docker compose -f infrastructure/docker-compose.yml up -d
```

This starts:
- PostgreSQL on port 5432
- Redis on port 6379
- MinIO (S3-compatible) on ports 9000/9001

### 3. Configure the API

```bash
cd apps/api
cp .env.example .env.local
# Edit .env.local and set strong JWT secrets
```

### 4. Start the API

```bash
cd apps/api
yarn start:dev
```

API runs at `http://localhost:3001/api/v1`  
Health check: `http://localhost:3001/api/v1/health`

### 5. Start the website

```bash
cd apps/web
yarn dev
```

Website runs at `http://localhost:3000`

### 6. Start the mobile app

```bash
cd apps/mobile
yarn start
```

Then press `a` for Android, `i` for iOS, or scan the QR code with Expo Go.

---

## Brand

**Luvora** — from "love" + "-ora" (light/aura).  
Pronounced: loo-VOR-ah  
Domain: `luvora.app` (to be confirmed — see Phase 1 notes)

---

## Build Phases

| Phase | Status | Description |
|-------|--------|-------------|
| 1 | 🟡 In Progress | Brand, design system, monorepo, mobile MVP scaffold |
| 2 | ⬜ Planned | Website deployment to Vercel |
| 3 | ⬜ Planned | Auth, database, real-time messaging |
| 4 | ⬜ Planned | End-to-end encryption (Signal Protocol) |
| 5 | ⬜ Planned | Offline queues + encrypted media |
| 6 | ⬜ Planned | Theme customization + couple games |
| 7 | ⬜ Planned | Profiles, stories, social feed |
| 8 | ⬜ Planned | Short-form video (reels) |
| 9 | ⬜ Planned | Hybrid AI companion |
| 10 | ⬜ Planned | Audio + video calling |
| 11 | ⬜ Planned | Security hardening + independent review |
| 12 | ⬜ Planned | Domain connection + app store release |

---

## Security

⚠️ **Phase 1 does not yet have end-to-end encryption enabled.**  
Messages in the current development build are stored in plaintext.  
Do not use this build for sensitive communications.

See [`docs/threat-model.md`](docs/threat-model.md) for the full security model.

---

## License

Private — all rights reserved. License to be determined before public release.
