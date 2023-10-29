import { createServerComponentClient } from '@/lib/db/server';
import { redirect } from 'next/navigation';

export default async function ProjectLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerComponentClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect(`/login`);

  return (
    <>
      {children}
      {/* <BackButton /> */}
    </>
  );
}
