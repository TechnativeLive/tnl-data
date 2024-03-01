'use client';

import { getBoulderingJudgeIndex } from '@/components/scoring-table-json/climbing/utils';
import { ScoringTableProps } from '@/components/scoring-table-json/scoring-table-json';
import { createBrowserClient } from '@/lib/db/client';
import { Sport, JudgeDataClimbing } from '@/lib/event-data';
import { EventResultClimbing } from '@/lib/event-data/climbing';
import { useDidUpdate } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCircleCheck } from '@tabler/icons-react';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { useParams } from 'next/navigation';
import { useState, useCallback } from 'react';

export type UpdateResultHelper = (args: {
  id: number;
  data: EventResultClimbing[number];
  feedback?: string | null;
  // message?: string;
}) => void;

export type UpdateActiveHelper = (args: {
  entrant?: number | undefined;
  feedback?: string | null;
  // message?: string;
}) => void;

function isSlugValid(slug?: Params[string]): slug is string {
  return !!slug && typeof slug === 'string';
}

export function useJudgeJson<S extends Sport>({
  round,
  class: cls,
  judgeData: initialJudgeData,
  station,
  blocCount,
}: {
  round: string | undefined;
  class: string | undefined;
  station: string;
  blocCount: number;
  judgeData: ScoringTableProps<S>['judgesData'][number] | undefined;
}) {
  const params = useParams();
  const eventSlug = params.event;

  const judgeIndex = getBoulderingJudgeIndex(station, blocCount);

  const [judgeData, setJudgeData] = useState(initialJudgeData ?? ({} as JudgeDataClimbing));
  useDidUpdate(
    () => setJudgeData(initialJudgeData ?? ({} as JudgeDataClimbing)),
    [initialJudgeData],
  );

  const supabase = createBrowserClient();
  const [loading, setLoading] = useState(false);

  const updateActive = useCallback<UpdateActiveHelper>(
    async ({ entrant, feedback }) => {
      if (!isSlugValid(eventSlug) || !round || !cls) {
        console.warn("Can't update judge active without event slug / round / class", {
          eventSlug,
          round,
          cls,
        });
        return;
      }

      setLoading(true);
      setJudgeData((current) => {
        const newResults: NonNullable<JudgeDataClimbing> = {
          ...current,
        } as NonNullable<JudgeDataClimbing>;
        newResults.active = {
          round,
          class: cls,
          entrant,
        };

        supabase
          .rpc('update_judge_data', {
            event: eventSlug,
            index: judgeIndex + 1,
            value: newResults,
          })
          .then(() => {
            setLoading(false);

            if (feedback !== null) {
              notifications.show({
                color: 'teal',
                icon: <IconCircleCheck />,
                message: feedback ?? 'Active entrant updated',
              });
            }
          });

        return newResults;
      });
    },
    [supabase, eventSlug, judgeIndex, cls, round],
  );

  const updateResult = useCallback<UpdateResultHelper>(
    ({ id, data, feedback }) => {
      if (!isSlugValid(eventSlug) || !round || !cls) {
        console.warn("Can't update judge active without event slug / round / class", {
          eventSlug,
          round,
          cls,
        });
        return;
      }

      setJudgeData((current) => {
        const newResults: NonNullable<JudgeDataClimbing> = {
          ...current,
        } as NonNullable<JudgeDataClimbing>;
        if (!newResults[round]) newResults[round] = {};
        if (!newResults[round]![cls]) newResults[round]![cls] = {};
        newResults[round]![cls]![id] = data;

        setLoading(true);

        // console.log({ id, data, newResults }); // update db
        supabase
          .rpc('update_judge_data', {
            event: eventSlug,
            index: judgeIndex + 1,
            value: newResults,
          })
          .then(() => {
            setLoading(false);
            if (feedback !== null)
              notifications.show({
                color: 'teal',
                icon: <IconCircleCheck />,
                message: feedback ?? 'Score submitted',
              });
          });

        return newResults;
      });
    },
    [setJudgeData, setLoading, supabase, eventSlug, round, cls, judgeIndex],
  );

  return {
    judgeData,
    updateActive,
    updateResult,
    loading,
  };
}
