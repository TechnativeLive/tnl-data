import { createRouteHandlerClient } from '@/lib/db/route-handler';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const formData = await request.formData();
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
  const redirectTo = formData.get('redirectTo');
  const supabase = createRouteHandlerClient();

  // if (!email || /^\S+@\S+$/.test(email)) {
  //   return NextResponse.redirect(`${requestUrl.origin}/login?email=Invalid email`, {
  //     // a 301 status is required to redirect from a POST to a GET route
  //     status: 301,
  //   });
  // }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.redirect(`${requestUrl.origin}/login?password=Incorrect password`, {
      // a 301 status is required to redirect from a POST to a GET route
      status: 301,
    });
  }

  const destination = redirectTo ? `${requestUrl.origin}${redirectTo}` : `${requestUrl.origin}/`;

  return NextResponse.redirect(destination, {
    // a 301 status is required to redirect from a POST to a GET route
    status: 301,
  });
}
