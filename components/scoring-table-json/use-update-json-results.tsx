'use client';

import { ScoringTableProps } from '@/components/scoring-table-json/scoring-table-json';
import { createBrowserClient } from '@/lib/db/client';
import { EventLiveData, Sport, EventResult, EventResults } from '@/lib/event-data';
import { updateDatastream } from '@/lib/singular/datastream';
import { useDidUpdate } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCircleCheck } from '@tabler/icons-react';
import { useParams } from 'next/navigation';
import { useState, useCallback } from 'react';

export type UpdateResultHelper<S extends Sport> = (args: {
  round: string;
  cls: string;
  id: number;
  data: EventResult<S>['result'];
  message?: string;
  feedback?: string | null;
}) => void;

export type UpdateActiveHelper = (args: {
  round?: string | undefined;
  cls?: string | undefined;
  entrant?: number | undefined;
  message?: string;
  feedback?: string | null;
}) => void;

export function useUpdateJsonResults<S extends Sport>(
  { results: initialResults, format, dsPrivateKey }: ScoringTableProps<S>,
  liveDataGenerator?: (data: Pick<ScoringTableProps<S>, 'format' | 'results'>) => EventLiveData<S>,
) {
  const params = useParams();
  const [results, setResults] = useState(initialResults);
  const [liveDataPreview, setLiveDataPreview] = useState<EventLiveData<S> | undefined>(
    liveDataGenerator?.({
      format,
      results,
    }),
  );

  // Keep results up to date with database changes
  // Note: this causes unnecessary re-renders. Consider using an atom linked to the realtime event
  useDidUpdate(() => {
    const newResults = initialResults;
    setResults(newResults);
    if (liveDataGenerator) {
      setLiveDataPreview(
        liveDataGenerator({
          format,
          results: newResults,
        }),
      );
    }
  }, [setResults, initialResults, format]);

  const supabase = createBrowserClient();
  const [loading, setLoading] = useState<
    false | [string | undefined, string | undefined, number | undefined]
  >(false);

  const updateActive = useCallback<UpdateActiveHelper>(
    ({ round, cls, entrant, message, feedback }) => {
      setResults((current) => {
        const newResults: EventResults<S> = { ...current };
        if (!newResults.active) newResults.active = { __ts: Date.now() };
        newResults.active.round = round;
        newResults.active.class = cls;
        newResults.active.entrant = entrant;
        newResults.active.__ts = Date.now();

        setLoading([round, cls, entrant]);
        // update datastream
        if (liveDataGenerator) {
          const liveData = liveDataGenerator({
            format,
            results: newResults,
          });
          setLiveDataPreview(liveData);
          updateDatastream(dsPrivateKey, liveData, message);
        }

        supabase
          .from('events')
          .update({ results: newResults })
          .eq('slug', params.event)
          .then(() => {
            setLoading(false);
            const message =
              feedback ?? entrant
                ? 'Active entrant updated'
                : cls
                  ? 'Active class updated'
                  : round
                    ? 'Active round updated'
                    : 'Active cleared';

            if (feedback !== null)
              notifications.show({
                color: 'teal',
                icon: <IconCircleCheck />,
                message,
              });
          });

        return newResults;
      });
    },
    [setResults, setLoading, supabase, params.event, dsPrivateKey, format, liveDataGenerator],
  );

  const updateResult = useCallback<UpdateResultHelper<S>>(
    ({ round, cls, id, data, message, feedback }) => {
      setResults((current) => {
        const newResults = { ...current };
        if (!newResults[round]) newResults[round] = {};
        if (!newResults[round]![cls]) newResults[round]![cls] = {};
        if (!newResults[round]![cls]![id])
          newResults[round]![cls]![id] = { result: {}, __ts: Date.now() } as EventResult<S>;
        newResults[round]![cls]![id] = { result: data, __ts: Date.now() };

        setLoading([round, cls, id]);
        // update datastream
        if (liveDataGenerator) {
          const liveData = liveDataGenerator({
            format,
            results: newResults,
          });
          setLiveDataPreview(liveData);
          updateDatastream(dsPrivateKey, liveData, message);
        }

        // update db
        supabase
          .from('events')
          .update({ results: newResults })
          .eq('slug', params.event)
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
    [setResults, setLoading, supabase, params.event, dsPrivateKey, format, liveDataGenerator],
  );

  return {
    results,
    updateActive,
    updateResult,
    liveDataPreview,
    loading,
  };
}
