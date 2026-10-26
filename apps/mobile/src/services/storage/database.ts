/**
 * Local SQLite database for Luvora.
 * Stores decrypted messages, conversations, and the outbox queue.
 *
 * Phase 1-3: stores messages in plaintext locally (development).
 * Phase 4: local storage is encrypted using SQLCipher or equivalent.
 */

import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export function getDatabase(): SQLite.SQLiteDatabase {
  if (!db) {
    db = SQLite.openDatabaseSync('luvora.db');
  }
  return db;
}

/** Run all schema migrations. Call once at app startup. */
export async function initDatabase(): Promise<void> {
  const database = getDatabase();

  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    -- Conversations cache
    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL CHECK(type IN ('direct','group')),
      name TEXT,
      avatar_url TEXT,
      disappearing_message_seconds INTEGER DEFAULT 0,
      theme_id TEXT,
      is_archived INTEGER DEFAULT 0,
      is_muted INTEGER DEFAULT 0,
      is_pinned INTEGER DEFAULT 0,
      unread_count INTEGER DEFAULT 0,
      last_message_json TEXT,
      updated_at TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    -- Messages (decrypted, stored locally only)
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
      sender_id TEXT NOT NULL,
      sender_device_id TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'text',
      text TEXT,
      attachments_json TEXT,
      reply_to_id TEXT,
      reactions_json TEXT DEFAULT '[]',
      is_edited INTEGER DEFAULT 0,
      is_deleted INTEGER DEFAULT 0,
      disappears_at TEXT,
      delivery_state TEXT NOT NULL DEFAULT 'local',
      idempotency_key TEXT UNIQUE,
      created_at TEXT NOT NULL,
      edited_at TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages(conversation_id, created_at DESC);

    -- Outbox queue (messages waiting to be sent)
    CREATE TABLE IF NOT EXISTS outbox (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      recipient_device_id TEXT NOT NULL,
      ciphertext TEXT NOT NULL,
      message_type INTEGER DEFAULT 0,
      idempotency_key TEXT NOT NULL UNIQUE,
      expires_at TEXT,
      retry_count INTEGER DEFAULT 0,
      next_retry_at TEXT,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','sending','failed')),
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_outbox_status ON outbox(status, next_retry_at);

    -- Drafts
    CREATE TABLE IF NOT EXISTS drafts (
      conversation_id TEXT PRIMARY KEY,
      text TEXT NOT NULL,
      saved_at TEXT NOT NULL
    );
  `);
}

// ---------------------------------------------------------------------------
// Conversation helpers
// ---------------------------------------------------------------------------

export interface LocalConversation {
  id: string;
  type: 'direct' | 'group';
  name?: string | null;
  avatarUrl?: string | null;
  themeId?: string | null;
  isArchived: boolean;
  isMuted: boolean;
  isPinned: boolean;
  unreadCount: number;
  updatedAt: string;
  createdAt: string;
}

export async function upsertConversation(conv: LocalConversation): Promise<void> {
  const db = getDatabase();
  await db.runAsync(
    `INSERT INTO conversations (id, type, name, avatar_url, theme_id, is_archived, is_muted, is_pinned, unread_count, updated_at, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       name = excluded.name,
       avatar_url = excluded.avatar_url,
       theme_id = excluded.theme_id,
       is_archived = excluded.is_archived,
       is_muted = excluded.is_muted,
       is_pinned = excluded.is_pinned,
       unread_count = excluded.unread_count,
       updated_at = excluded.updated_at`,
    [
      conv.id,
      conv.type,
      conv.name ?? null,
      conv.avatarUrl ?? null,
      conv.themeId ?? null,
      conv.isArchived ? 1 : 0,
      conv.isMuted ? 1 : 0,
      conv.isPinned ? 1 : 0,
      conv.unreadCount,
      conv.updatedAt,
      conv.createdAt,
    ],
  );
}

export async function getConversations(): Promise<LocalConversation[]> {
  const db = getDatabase();
  const rows = await db.getAllAsync<Record<string, unknown>>(
    `SELECT * FROM conversations WHERE is_archived = 0 ORDER BY updated_at DESC`,
  );
  return rows.map(rowToConversation);
}

function rowToConversation(row: Record<string, unknown>): LocalConversation {
  return {
    id: row['id'] as string,
    type: row['type'] as 'direct' | 'group',
    name: row['name'] as string | null,
    avatarUrl: row['avatar_url'] as string | null,
    themeId: row['theme_id'] as string | null,
    isArchived: Boolean(row['is_archived']),
    isMuted: Boolean(row['is_muted']),
    isPinned: Boolean(row['is_pinned']),
    unreadCount: row['unread_count'] as number,
    updatedAt: row['updated_at'] as string,
    createdAt: row['created_at'] as string,
  };
}

// ---------------------------------------------------------------------------
// Outbox helpers
// ---------------------------------------------------------------------------

export interface OutboxItem {
  id: string;
  conversationId: string;
  recipientDeviceId: string;
  ciphertext: string;
  messageType: number;
  idempotencyKey: string;
  expiresAt?: string;
  retryCount: number;
  nextRetryAt?: string;
  status: 'pending' | 'sending' | 'failed';
  createdAt: string;
}

export async function addToOutbox(item: Omit<OutboxItem, 'retryCount' | 'status'>): Promise<void> {
  const db = getDatabase();
  await db.runAsync(
    `INSERT OR IGNORE INTO outbox (id, conversation_id, recipient_device_id, ciphertext, message_type, idempotency_key, expires_at, retry_count, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 0, 'pending', ?)`,
    [
      item.id,
      item.conversationId,
      item.recipientDeviceId,
      item.ciphertext,
      item.messageType,
      item.idempotencyKey,
      item.expiresAt ?? null,
      item.createdAt,
    ],
  );
}

export async function getPendingOutbox(): Promise<OutboxItem[]> {
  const db = getDatabase();
  const now = new Date().toISOString();
  const rows = await db.getAllAsync<Record<string, unknown>>(
    `SELECT * FROM outbox WHERE status = 'pending' AND (next_retry_at IS NULL OR next_retry_at <= ?) ORDER BY created_at ASC LIMIT 20`,
    [now],
  );
  return rows.map((r) => ({
    id: r['id'] as string,
    conversationId: r['conversation_id'] as string,
    recipientDeviceId: r['recipient_device_id'] as string,
    ciphertext: r['ciphertext'] as string,
    messageType: r['message_type'] as number,
    idempotencyKey: r['idempotency_key'] as string,
    expiresAt: r['expires_at'] as string | undefined,
    retryCount: r['retry_count'] as number,
    nextRetryAt: r['next_retry_at'] as string | undefined,
    status: r['status'] as OutboxItem['status'],
    createdAt: r['created_at'] as string,
  }));
}

export async function removeFromOutbox(id: string): Promise<void> {
  await getDatabase().runAsync(`DELETE FROM outbox WHERE id = ?`, [id]);
}

export async function incrementOutboxRetry(id: string, retryCount: number): Promise<void> {
  // Exponential backoff: 2^retryCount seconds, capped at 5 minutes
  const backoffSeconds = Math.min(Math.pow(2, retryCount), 300);
  const nextRetry = new Date(Date.now() + backoffSeconds * 1000).toISOString();
  await getDatabase().runAsync(
    `UPDATE outbox SET retry_count = ?, next_retry_at = ? WHERE id = ?`,
    [retryCount, nextRetry, id],
  );
}
