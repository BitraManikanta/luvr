# Luvora – Threat Model

> Last updated: Phase 1
> Status: Draft – subject to independent security review before launch

## What Luvora Protects Against

| Threat | Protection | Phase |
|--------|-----------|-------|
| Passive network interception of messages | TLS 1.3 | Phase 1 |
| Server operator reading private chats | E2E encryption (Signal Protocol) | Phase 4 |
| Fake messages from attacker impersonating sender | Authenticated E2E encryption | Phase 4 |
| Replay attacks | Message nonces + session ratchet | Phase 4 |
| Future key compromise exposing past messages | Forward secrecy (Double Ratchet) | Phase 4 |
| Man-in-the-middle on E2E session setup | Safety number / QR verification | Phase 4 |
| Identity key substitution by server | Out-of-band key verification | Phase 4 |
| Unauthorized media access | Short-lived signed URLs, auth checks | Phase 5 |
| Brute-force login | Rate limiting, bcrypt | Phase 1 |
| CSRF, XSS on web | Helmet.js, CSP headers | Phase 1 |
| Session hijacking | Short-lived JWT + refresh rotation | Phase 1 |
| Unauthorized group access | Strict membership checks | Phase 3 |

## What Luvora Cannot Protect Against

| Threat | Explanation |
|--------|------------|
| Compromised sender device | If the device is rooted or malware is present, local decrypted messages can be read |
| Compromised recipient device | Same as above for the other party |
| Screenshots and forwards by the recipient | The recipient legitimately decrypts messages; we cannot prevent them copying content |
| Backup exposure | Cloud backups (iCloud, Google Drive) may contain plaintext data unless encrypted backups are used |
| Metadata analysis | Even with E2E encryption, we see: who communicates with whom, frequency, approximate timing, and approximate message sizes. Delivery metadata is stored temporarily. |
| Legal compulsion | If served a valid legal order, we can disclose the metadata we retain. We cannot disclose message plaintext we do not have. |
| Social engineering | A malicious contact can be added by a user; we cannot prevent this |
| Device seizure | Physical access to an unlocked device circumvents application-level security |
| Nation-state adversaries with device-level access | Out of scope for this application |

## Phase 1 Specific Limitations

⚠️ In Phase 1, end-to-end encryption is NOT yet enabled. Messages are:
- Transmitted over HTTPS (TLS encryption in transit)
- Stored in plaintext in the PostgreSQL database
- Accessible to server operators and database administrators

This is a DEVELOPMENT-ONLY configuration. The app UI will display a prominent
"[Dev Mode – Not E2E Encrypted]" banner until Phase 4 encryption is live.

NO real sensitive personal communications should be made using the Phase 1 build.

## Retained Data

| Data | Retention |
|------|-----------|
| Encrypted message envelopes (Phase 4+) | Until explicitly deleted by user or expiry timer |
| Message plaintext (Phase 1–3 dev) | Until Phase 4 — then migrated/deleted |
| Push tokens | Until device is unregistered |
| Public key material | Until device is revoked |
| Delivery metadata | 30 days after delivery |
| Public posts/stories | Until user deletes or account deleted |
| Account data | Until account deletion + 30-day grace period |

## Independent Review

An independent security review by a qualified third party is planned before
public launch (Phase 11). The threat model, encryption implementation, and
server configuration will all be in scope.

Passing internal tests does not substitute for an independent review.
