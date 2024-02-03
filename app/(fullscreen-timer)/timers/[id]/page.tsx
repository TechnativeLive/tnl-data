import { FullscreenTimer } from '@/components/timer/fullscreen';
import { PageProps } from '@/lib/types';
import { notFound } from 'next/navigation';
import { Chivo } from 'next/font/google'

const chivo = Chivo({ subsets: ['latin'] })

// export const dynamic = 'force-dynamic';

export default async function FullscreenTimerPage({
  params,
  searchParams,
}: PageProps<{ id: string }, {}>) {
  if (!params?.id) return notFound();

  return <FullscreenTimer id={params.id} className={chivo.className} />
}
