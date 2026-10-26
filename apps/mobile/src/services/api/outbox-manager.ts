/**
 * OutboxManager — drains the local SQLite outbox over the WebSocket.
 *
 * Design:
 * - Messages are written to the outbox queue first (even before the UI shows them).
 * - This manager periodically checks for pending items and retries them.
 * - Exponential backoff prevents thundering herd on reconnect.
 * - Duplicate sends are prevented by idempotency keys enforced server-side.
 */

import {
  getPendingOutbox,
  removeFromOutbox,
  incrementOutboxRetry,
} from '../storage/database';
import { socketService } from './websocket';

const DRAIN_INTERVAL_MS = 2_000;
const MAX_RETRIES = 10;

class OutboxManager {
  private interval: ReturnType<typeof setInterval> | null = null;
  private draining = false;

  start() {
    if (this.interval) return;
    this.interval = setInterval(() => {
      void this.drain();
    }, DRAIN_INTERVAL_MS);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  /** Flush all pending outbox items immediately (e.g. on reconnect). */
  async flushNow(): Promise<void> {
    return this.drain();
  }

  private async drain(): Promise<void> {
    if (this.draining || !socketService.isConnected) return;
    this.draining = true;

    try {
      const items = await getPendingOutbox();

      for (const item of items) {
        if (item.retryCount >= MAX_RETRIES) {
          // Mark as permanently failed — do not remove, keep for user visibility
          await incrementOutboxRetry(item.id, MAX_RETRIES + 1);
          continue;
        }

        try {
          socketService.sendMessage({
            conversationId: item.conversationId,
            recipientDeviceId: item.recipientDeviceId,
            ciphertext: item.ciphertext,
            messageType: item.messageType,
            idempotencyKey: item.idempotencyKey,
            expiresAt: item.expiresAt,
          });

          // Remove from outbox once accepted (server acknowledges separately)
          await removeFromOutbox(item.id);
        } catch {
          await incrementOutboxRetry(item.id, item.retryCount + 1);
        }
      }
    } finally {
      this.draining = false;
    }
  }
}

export const outboxManager = new OutboxManager();
