import { Shell } from '@/components/shell/shell';
import { createServerClient } from '@/lib/db/server';

export async function ShellWithProfile({ children }: { children: React.ReactNode }) {
  const supabase = createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  let user: Tables<'profiles'> | null = null;
  if (session?.user.id) {
    const res = await supabase.from('profiles').select().single();

    if (res.data) {
      user = res.data;
    }
  }

  const definedNameParts = [user?.first_name, user?.last_name].filter(Boolean);
  const name = definedNameParts.join(' ');
  const initials = definedNameParts.map((name) => name.charAt(0)).join('') ?? '?';

  return (
    <Shell name={name} email={session?.user.email} initials={initials}>
      {children}
    </Shell>
  );
}
