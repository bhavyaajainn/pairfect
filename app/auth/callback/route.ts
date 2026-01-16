import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );
    await supabase.auth.exchangeCodeForSession(code);
  }


  // URL to redirect to after sign in process completes
  // Force localhost redirect when running locally
  const isLocalhost = requestUrl.origin.includes('localhost') || requestUrl.origin.includes('127.0.0.1');
  const redirectUrl = isLocalhost 
    ? 'http://localhost:3000/dashboard'
    : `${requestUrl.origin}/dashboard`;
  
  return NextResponse.redirect(redirectUrl);
}
