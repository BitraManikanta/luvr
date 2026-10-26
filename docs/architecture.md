# Luvora – Architecture Overview

## Repository Layout

```
luvora/
├── apps/
│   ├── mobile/          React Native + Expo (iOS & Android)
│   ├── web/             Next.js public website (Vercel)
│   └── api/             NestJS backend (Node.js + PostgreSQL)
├── packages/
│   ├── shared-types/    TypeScript types shared across all apps
│   ├── design-system/   Theme engine, tokens, React components
│   ├── contracts/       Validated API request/response schemas (Zod)
│   ├── validation/      Shared Zod validators
│   ├── cryptography-adapter/  E2E encryption abstraction (Phase 4)
│   └── test-fixtures/   Shared test data generators
├── infrastructure/
│   ├── docker-compose.yml   Local dev: PostgreSQL, Redis, MinIO
│   └── database/
│       ├── migrations/      TypeORM migration files
│       └── seeds/           Development seed data
└── docs/
    ├── architecture.md  (this file)
    ├── threat-model.md
    ├── privacy-model.md
    ├── deployment.md
    └── api.md
```

## Technology Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Mobile | React Native + Expo SDK 52 | Cross-platform, large ecosystem, Expo's managed workflow |
| Mobile routing | Expo Router v4 | File-based routing, deep linking, typed routes |
| Mobile state | Zustand + TanStack Query | Lightweight local state + server state with caching |
| Mobile local DB | Expo SQLite | Durable offline message storage |
| Mobile secure storage | Expo SecureStore | iOS Keychain / Android Keystore |
| Backend framework | NestJS | Structured, testable, decorator-based Node.js |
| Backend language | TypeScript (strict) | Type safety across the stack |
| Database | PostgreSQL 16 | Relational, reliable, excellent JSON support |
| ORM | TypeORM | TypeScript-native, migration support |
| Cache / presence | Redis 7 | Real-time presence, rate limiting, job queues |
| Message queue | BullMQ | Retries, scheduled tasks, media processing |
| Object storage | S3-compatible (MinIO local, production TBD) | Encrypted media storage |
| Real-time | Socket.IO | WebSocket transport for message delivery |
| Website | Next.js 15 | App Router, server components, Vercel deployment |
| Styling | Tailwind CSS | Utility-first, consistent design tokens |
| Animations | Framer Motion | Web; React Native Reanimated for mobile |
| Build system | Turborepo | Incremental builds, shared pipeline |

## Data Flow – Private Message

```
[Sender Device]
  1. User types message
  2. Message stored locally in SQLite (state: local)
  3. Encryption: message encrypted with E2E session key (Phase 4)
  4. Encrypted envelope placed in outbox queue
  5. Connectivity? → Send envelope to API server (state: sending)

[API Server]
  6. Server receives ENCRYPTED envelope — cannot read content
  7. Stores encrypted envelope keyed by recipient device ID
  8. Sends WebSocket push to recipient if online (state: delivered)
  9. Falls back to push notification if offline

[Recipient Device]
  10. Receives encrypted envelope
  11. Decrypts locally using session key
  12. Stores decrypted message in local SQLite
  13. Sends read receipt when message screen is opened (state: read)
```

## End-to-End Encryption (Phase 4 Preview)

The encryption architecture is designed around the Signal Protocol's Double Ratchet
Algorithm, which provides:

- Forward secrecy: Past messages cannot be decrypted if a key is later compromised
- Post-compromise security (break-in recovery): Future messages recover security
  after a key compromise
- Authenticated encryption: Messages cannot be forged or tampered with

Implementation plan (Phase 4):
- Use `@signalapp/libsignal-client` (official, reviewed, Apache-2.0)
- Key material generated on device and NEVER transmitted to server
- Public identity keys and signed prekeys uploaded to server
- One-time prekeys consumed during session establishment
- Per-conversation session state stored encrypted in SQLite

⚠️ E2E encryption is NOT yet active in Phase 1. Messages are transported over
HTTPS but not yet end-to-end encrypted. This will be clearly indicated in the
app UI and is documented in the threat model.

## Security Boundaries

| Content Type | Encrypted in Transit | E2E Encrypted | Server Can Read? |
|---|---|---|---|
| Private messages (Phase 4+) | ✓ TLS | ✓ Signal Protocol | ✗ Never |
| Private messages (Phase 1–3) | ✓ TLS | ✗ Not yet | ⚠️ Yes – development only |
| Media attachments (Phase 5+) | ✓ TLS | ✓ Client-side AES-256-GCM | ✗ Never |
| Stories / public posts | ✓ TLS | ✗ Not applicable (public content) | ✓ Yes |
| Reels / video | ✓ TLS | ✗ Not applicable (public content) | ✓ Yes |
| Call audio/video (Phase 10) | ✓ TLS + DTLS-SRTP | Planned (design TBD) | Review required |

## Database Schema (key tables)

- `users` – account + profile
- `devices` – per-device identity keys (Phase 4)
- `conversations` – conversation metadata (no plaintext messages)
- `conversation_participants` – membership
- `encrypted_envelopes` – the opaque E2E encrypted payloads
- `delivery_acknowledgements` – per-device delivery state
- `encrypted_attachments` – encrypted media references (no keys)
- `prekeys` – public key material for E2E session establishment (Phase 4)
- `stories` – public story content
- `posts` – public feed posts
- `follows` – follower graph
- `game_sessions` – game state (references converation)
- `couple_profiles` – couple bonds
- `shared_memories` – scrapbook entries
- `push_tokens` – FCM/APNs tokens (not associated with messages)
- `moderation_reports` – user-submitted reports

## Performance Budgets

| Metric | Target |
|--------|--------|
| App cold-start to first frame | < 1.5 s |
| Chat list render | < 100 ms |
| Message send (local echo) | Immediate (optimistic) |
| Image load from cache | < 200 ms |
| API health check response | < 100 ms |
