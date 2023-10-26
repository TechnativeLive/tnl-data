import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@/lib/db/server';

export default async function Unauthenticated() {
  const supabase = createServerComponentClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) redirect('/dashboard');

  return (
    <div className="flex-1 grid place-content-center">
      <p>
        Please{' '}
        <Link href="/login" className="text-emerald-400 font-bold underline underline-offset-2">
          Sign In
        </Link>{' '}
        to see your dashboard
      </p>
    </div>
  );
}
