import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Initial Luvora database schema.
 * Separates public social content from encrypted message storage.
 */
export class InitialSchema1700000000000 implements MigrationInterface {
  name = 'InitialSchema1700000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    // -----------------------------------------------------------------------
    // Users
    // -----------------------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id"            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        "username"      VARCHAR(30)  NOT NULL UNIQUE,
        "display_name"  VARCHAR(50)  NOT NULL,
        "email"         VARCHAR(255) NOT NULL UNIQUE,
        "password_hash" VARCHAR(255) NOT NULL,
        "avatar_url"    TEXT,
        "bio"           TEXT,
        "is_private"    BOOLEAN NOT NULL DEFAULT FALSE,
        "is_verified"   BOOLEAN NOT NULL DEFAULT FALSE,
        "is_deleted"    BOOLEAN NOT NULL DEFAULT FALSE,
        "deleted_at"    TIMESTAMPTZ,
        "created_at"    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updated_at"    TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await queryRunner.query(`CREATE INDEX "idx_users_username" ON "users"("username")`);
    await queryRunner.query(`CREATE INDEX "idx_users_email" ON "users"("email")`);

    // -----------------------------------------------------------------------
    // Devices + key material
    // -----------------------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE "devices" (
        "id"                   UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        "user_id"              UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "name"                 VARCHAR(100) NOT NULL,
        "platform"             VARCHAR(10)  NOT NULL CHECK(platform IN ('ios','android','web')),
        "identity_key_public"  TEXT NOT NULL,
        "registration_id"      INTEGER NOT NULL,
        "push_token"           TEXT,
        "push_platform"        VARCHAR(10) CHECK(push_platform IN ('fcm','apns')),
        "last_seen_at"         TIMESTAMPTZ,
        "is_revoked"           BOOLEAN NOT NULL DEFAULT FALSE,
        "created_at"           TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await queryRunner.query(`CREATE INDEX "idx_devices_user_id" ON "devices"("user_id")`);

    await queryRunner.query(`
      CREATE TABLE "signed_prekeys" (
        "id"         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        "device_id"  UUID NOT NULL REFERENCES "devices"("id") ON DELETE CASCADE,
        "key_id"     INTEGER NOT NULL,
        "public_key" TEXT NOT NULL,
        "signature"  TEXT NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await queryRunner.query(`CREATE INDEX "idx_spk_device" ON "signed_prekeys"("device_id")`);

    await queryRunner.query(`
      CREATE TABLE "one_time_prekeys" (
        "id"           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        "device_id"    UUID NOT NULL REFERENCES "devices"("id") ON DELETE CASCADE,
        "key_id"       INTEGER NOT NULL,
        "public_key"   TEXT NOT NULL,
        "is_consumed"  BOOLEAN NOT NULL DEFAULT FALSE,
        "consumed_at"  TIMESTAMPTZ,
        "created_at"   TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "idx_otpk_device_consumed" ON "one_time_prekeys"("device_id", "is_consumed")`,
    );

    // -----------------------------------------------------------------------
    // Conversations (no plaintext content stored here)
    // -----------------------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE "conversations" (
        "id"                              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        "type"                            VARCHAR(10) NOT NULL CHECK(type IN ('direct','group')),
        "name"                            VARCHAR(100),
        "avatar_url"                      TEXT,
        "disappearing_message_seconds"    INTEGER NOT NULL DEFAULT 0,
        "created_at"                      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updated_at"                      TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "conversation_participants" (
        "id"                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        "conversation_id"       UUID NOT NULL REFERENCES "conversations"("id") ON DELETE CASCADE,
        "user_id"               UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "role"                  VARCHAR(10) NOT NULL DEFAULT 'member' CHECK(role IN ('admin','member')),
        "last_read_message_id"  UUID,
        "last_read_at"          TIMESTAMPTZ,
        "is_muted"              BOOLEAN NOT NULL DEFAULT FALSE,
        "is_archived"           BOOLEAN NOT NULL DEFAULT FALSE,
        "joined_at"             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE("conversation_id", "user_id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "idx_cp_user" ON "conversation_participants"("user_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_cp_conv" ON "conversation_participants"("conversation_id")`,
    );

    // -----------------------------------------------------------------------
    // Encrypted envelopes (opaque to server)
    // -----------------------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE "encrypted_envelopes" (
        "id"                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        "conversation_id"     UUID NOT NULL REFERENCES "conversations"("id") ON DELETE CASCADE,
        "sender_device_id"    VARCHAR(36) NOT NULL,
        "recipient_device_id" VARCHAR(36) NOT NULL,
        "ciphertext"          TEXT NOT NULL,
        "message_type"        SMALLINT NOT NULL DEFAULT 0,
        "idempotency_key"     VARCHAR(36) NOT NULL UNIQUE,
        "expires_at"          TIMESTAMPTZ,
        "is_delivered"        BOOLEAN NOT NULL DEFAULT FALSE,
        "delivered_at"        TIMESTAMPTZ,
        "created_at"          TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "idx_ee_conv_date" ON "encrypted_envelopes"("conversation_id", "created_at" DESC)`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_ee_recipient" ON "encrypted_envelopes"("recipient_device_id", "is_delivered")`,
    );

    // -----------------------------------------------------------------------
    // Social: follows
    // -----------------------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE "follows" (
        "id"            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        "follower_id"   UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "following_id"  UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "status"        VARCHAR(10) NOT NULL DEFAULT 'following' CHECK(status IN ('pending','following')),
        "created_at"    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE("follower_id", "following_id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "idx_follows_follower" ON "follows"("follower_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_follows_following" ON "follows"("following_id")`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "follows"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "encrypted_envelopes"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "conversation_participants"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "conversations"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "one_time_prekeys"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "signed_prekeys"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "devices"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
  }
}
