import { createServerClient } from '@/lib/db/server';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ProjectLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect(`/login`);

  return <>{children}</>;
}
