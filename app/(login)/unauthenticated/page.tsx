import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/db/server';

export default async function Unauthenticated() {
  const supabase = createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) redirect('/');

  return (
    <div className="flex-1 grid place-content-center p-8">
      <p>
        Please{' '}
        <Link href="/login" className="text-green-4 font-bold underline underline-offset-2">
          Sign In
        </Link>
      </p>
    </div>
  );
}
