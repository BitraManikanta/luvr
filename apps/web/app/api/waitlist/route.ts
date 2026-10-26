/**
 * Waitlist signup API route.
 * In production this should store to a DB or a service like Loops / ConvertKit.
 * For now it validates the email and returns success.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email().max(255),
});

// In-memory store for development only — replace with DB in production
const waitlistEmails = new Set<string>();

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid email address.' },
        { status: 400 },
      );
    }

    const { email } = parsed.data;

    if (waitlistEmails.has(email)) {
      // Idempotent — don't expose whether the email already exists
      return NextResponse.json({ success: true });
    }

    waitlistEmails.add(email);

    // TODO Phase 2: persist to PostgreSQL waitlist table or email service
    console.log(`[Waitlist] New signup: ${email} (total: ${waitlistEmails.size})`);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
