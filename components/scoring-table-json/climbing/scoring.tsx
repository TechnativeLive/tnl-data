'use client';

import { ClimbingHeadJudge } from '@/components/scoring-table-json/climbing/head-judge';
import { ClimbingJudgeSelection } from '@/components/scoring-table-json/climbing/judge-selection';
import { ClimbingMinorJudge } from '@/components/scoring-table-json/climbing/minor-judge';
import { ScoringTableProps } from '@/components/scoring-table-json/scoring-table-json';
import { createBrowserClient } from '@/lib/db/client';
import { useDidUpdate } from '@mantine/hooks';
import { useParams, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export function ScoringTableJsonClimbing({
  format,
  results: initialResults,
  dsPrivateKey,
}: ScoringTableProps<'climbing'>) {
  const searchParams = useSearchParams();

  const params = useParams();
  const [results, setResults] = useState(initialResults);

  useDidUpdate(() => {
    setResults(initialResults);
  }, [setResults, initialResults, format]);

  const supabase = createBrowserClient();
  const [loading, setLoading] = useState<
    false | [string | undefined, string | undefined, number | undefined]
  >(false);

  const station = searchParams.get('judge');

  if (!station) {
    return <ClimbingJudgeSelection blocCount={4} />;
  }

  if (station === 'head') {
    return <ClimbingHeadJudge />;
  }

  return <ClimbingMinorJudge station={station} />;
}
