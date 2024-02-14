import { Notifications } from '@mantine/notifications';
import { ShellWithProfile } from '@/components/shell/shell-with-profile';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Notifications containerWidth={340} autoClose={3000} limit={3} />
      <ShellWithProfile>{children}</ShellWithProfile>
    </>
  );
}
