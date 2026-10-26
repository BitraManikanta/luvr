# Luvora – Privacy Model

## Content Types and Their Storage

| Content | Where stored | Who can read | E2E encrypted? |
|---------|-------------|--------------|----------------|
| Private messages (Phase 4+) | Encrypted envelope on server + decrypted in client SQLite | Only sender & recipient devices | ✅ Yes |
| Private messages (Phase 1-3 dev) | Plaintext in PostgreSQL | Server operators | ⚠️ Dev only |
| Media in private chats (Phase 5+) | Encrypted blob in S3 | Only sender & recipient | ✅ Yes |
| Stories | Server storage | Story audience as configured | ❌ Not E2E (public content) |
| Public posts | Server storage | Followers / public | ❌ Not E2E (public content) |
| Reels | Server storage | Public | ❌ Not E2E (public content) |
| Couple features (memories, letters) | Encrypted on server (Phase 4+) | Only the two partners | ✅ Planned |
| AI requests (on-device) | Not transmitted | Only you | ✅ Local only |
| AI requests (cloud, opt-in) | Sent to AI provider | AI provider (disclosed) | ❌ Not E2E |
| Call audio/video (Phase 10) | Not stored (real-time) | Design TBD | 🔍 Under review |

## Data Minimization Principles

1. **Collect nothing beyond what's necessary.** Registration needs only a username, email, and password hash.
2. **Delivery metadata expires.** Envelope delivery records are purged 30 days after delivery.
3. **Push tokens are not message content.** They only tell us where to deliver an alert — not what the message says.
4. **Public content is public.** We are honest that stories and posts are visible to their configured audience and stored in plaintext.
5. **AI processing is opt-in and transparent.** Before any content reaches a cloud AI, you see exactly what will be sent and can cancel.

## What Luvora Cannot Guarantee

- **Device security.** If your phone is compromised, so are your decrypted messages.
- **Recipient behavior.** The person you're chatting with can screenshot or forward your messages.
- **Backup security.** iCloud and Google backups may contain your decrypted SQLite database unless you use encrypted backups and understand their scope.
- **Metadata privacy.** Even with full E2E encryption, we necessarily process: who is communicating with whom, approximate message timing, and delivery state. This is unavoidable in a messaging system.
- **Legal orders.** We will comply with valid legal orders. We can disclose metadata we hold. We cannot disclose message content we do not have.

## User Controls

- Delete a message → removes from local device immediately; server deletes the encrypted envelope
- Delete account → all encrypted envelopes deleted; profile soft-deleted; account hard-deleted after 30 days
- Revoke a device → that device's prekeys are deleted; it can no longer decrypt future messages
- Export data → downloadable archive of your non-encrypted data (profile, posts, story metadata)
- Disappearing messages → auto-delete envelopes after configured time (enforced by server expiry + client timer)
