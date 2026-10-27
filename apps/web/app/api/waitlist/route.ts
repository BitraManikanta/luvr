/**
 * Waitlist signup API route.
 * Persists email to the Supabase `waitlist` table (public, no auth required).
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '../../../lib/supabase/server';

const schema = z.object({
  email: z.string().email().max(255),
});

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    const { email } = parsed.data;
    const supabase = await createClient();

    const { error } = await supabase
      .from('waitlist')
      .insert({ email })
      .select()
      .maybeSingle();

    if (error) {
      // Duplicate email — treat as success (don't expose whether email exists)
      if (error.code === '23505') {
        return NextResponse.json({ success: true });
      }
      console.error('[Waitlist] Supabase error:', error.message);
      return NextResponse.json({ error: 'Could not save. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
