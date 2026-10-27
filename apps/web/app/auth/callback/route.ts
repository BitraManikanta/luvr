/**
 * Supabase Auth callback handler.
 * Supabase redirects here after email confirmation and OAuth flows.
 * Exchanges the code for a session and redirects the user.
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '../../../lib/supabase/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/app/dashboard';
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If something went wrong, send them to login with an error flag
  return NextResponse.redirect(`${origin}/login?error=auth`);
}
