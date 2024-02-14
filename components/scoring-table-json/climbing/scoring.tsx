'use client';

import { ClimbingHeadJudge } from '@/components/scoring-table-json/climbing/head-judge';
import { ClimbingJudgeSelection } from '@/components/scoring-table-json/climbing/judge-selection';
import { ClimbingMinorJudge } from '@/components/scoring-table-json/climbing/minor-judge';
import { ScoringTableProps } from '@/components/scoring-table-json/scoring-table-json';
import { EventTimersProvider } from '@/components/timer/event-timers-context';
import { useSearchParams } from 'next/navigation';

export function ScoringTableJsonClimbing(props: ScoringTableProps<'climbing'>) {
  const searchParams = useSearchParams();
  const station = searchParams.get('judge');

  if (!station) {
    return <ClimbingJudgeSelection blocCount={4} />;
  }

  if (station === 'head') {
    return <ClimbingHeadJudge {...props} />;
  }

  return (
    <EventTimersProvider ids={props.timers}>
      <ClimbingMinorJudge {...props} />
    </EventTimersProvider>
  );
}
