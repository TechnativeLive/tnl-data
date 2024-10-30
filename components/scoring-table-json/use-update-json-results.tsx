'use client'

import { ScoringTableProps } from '@/components/scoring-table-json/scoring-table-json'
import { createBrowserClient } from '@/lib/db/client'
import { EventLiveData, Sport, EventResult, EventResults } from '@/lib/event-data'
import { updateDatastreams } from '@/lib/singular/datastream'
import { useDidUpdate } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { IconCircleCheck } from '@tabler/icons-react'
import { useParams } from 'next/navigation'
import { useState, useCallback } from 'react'

export type UpdateResultHelper<S extends Sport> = (args: {
  round: string
  cls: string
  id: number
  data: EventResult<S>['result']
  status?: 'DNS' | 'DNF' | 'DQ'
  message?: string
  feedback?: string | null
}) => void

export type UpdateActiveHelper = (args: {
  round?: string | undefined
  cls?: string | undefined
  entrant?: number | undefined
  message?: string
  feedback?: string | null
}) => void

export function useUpdateJsonResults<S extends Sport>(
  {
    results: initialResults,
    format,
    dsPrivateKey,
    judgesData,
    formatOptions,
  }: ScoringTableProps<S>,
  liveDataGenerator?: (
    data: Pick<ScoringTableProps<S>, 'format' | 'results' | 'judgesData' | 'formatOptions'>,
  ) => EventLiveData<S>,
) {
  const params = useParams()
  const eventSlug = params.event
  const [results, setResults] = useState(initialResults)
  const [liveDataPreview, setLiveDataPreview] = useState<EventLiveData<S> | undefined>(
    liveDataGenerator?.({
      format,
      results,
      judgesData,
      formatOptions,
    }),
  )

  // Keep results up to date with database changes
  // Note: this causes unnecessary re-renders. Consider using an atom linked to the realtime event
  useDidUpdate(() => {
    const newResults = initialResults
    setResults(newResults)
    if (liveDataGenerator) {
      const liveData = liveDataGenerator({
        format,
        results: newResults,
        judgesData,
        formatOptions,
      })
      setLiveDataPreview(liveData)

      // // Searchwords: Bloc data, blocdata, _format, formatOptions
      // @ts-expect-error Hacky workaround for multiple datastreams - should come up with something permanent
      const { blocData, ...coreLiveData } = liveData
      updateDatastreams([
        { privateKey: dsPrivateKey, body: coreLiveData },
        { privateKey: formatOptions?.blocDataDsKey, body: blocData },
      ])
    }
  }, [
    setResults,
    initialResults,
    format,
    liveDataGenerator,
    setLiveDataPreview,
    dsPrivateKey,
    formatOptions?.blocDataDsKey,
  ])

  const supabase = createBrowserClient()
  const [loading, setLoading] = useState<
    false | [string | undefined, string | undefined, number | undefined]
  >(false)

  const updateActive = useCallback<UpdateActiveHelper>(
    ({ round, cls, entrant, message, feedback }) => {
      if (!eventSlug || typeof eventSlug !== 'string') {
        console.warn("Can't update active without event slug")
        return
      }
      setResults((current) => {
        const newResults: EventResults<S> = { ...current }
        if (!newResults.active) newResults.active = {}
        newResults.active.round = round
        newResults.active.class = cls
        newResults.active.entrant = entrant

        setLoading([round, cls, entrant])
        // update datastream
        if (liveDataGenerator) {
          const liveData = liveDataGenerator({
            format,
            results: newResults,
            judgesData,
            formatOptions,
          })
          setLiveDataPreview(liveData)

          // // Searchwords: Bloc data, blocdata, _format, formatOptions
          // @ts-expect-error Hacky workaround for multiple datastreams - should come up with something permanent
          const { blocData, ...coreLiveData } = liveData
          updateDatastreams([
            { privateKey: dsPrivateKey, body: coreLiveData, customMessage: message },
            { privateKey: formatOptions?.blocDataDsKey, body: blocData },
          ])
        }

        supabase
          .from('events')
          .update({ results: newResults })
          .eq('slug', eventSlug)
          .then(() => {
            setLoading(false)
            const message =
              feedback ?? entrant
                ? 'Active entrant updated'
                : cls
                  ? 'Active class updated'
                  : round
                    ? 'Active round updated'
                    : 'Active cleared'

            if (feedback !== null)
              notifications.show({
                color: 'teal',
                icon: <IconCircleCheck />,
                message,
              })
          })

        return newResults
      })
    },
    [
      setResults,
      setLoading,
      supabase,
      format,
      liveDataGenerator,
      eventSlug,
      judgesData,
      formatOptions,
      dsPrivateKey,
    ],
  )

  const updateResult = useCallback<UpdateResultHelper<S>>(
    ({ round, cls, id, data, status, message, feedback }) => {
      if (!eventSlug || typeof eventSlug !== 'string') {
        console.warn("Can't update result without event slug")
        return
      }
      setResults((current) => {
        const newResults = { ...current }
        if (!newResults[round]) newResults[round] = {}
        if (!newResults[round]![cls]) newResults[round]![cls] = {}
        if (!newResults[round]![cls]![id])
          newResults[round]![cls]![id] = {
            result: {} as EventResult<S>['result'],
            // __ts: Date.now(),
            status,
          }
        newResults[round]![cls]![id] = {
          result: data,
          // __ts: Date.now(),
          status,
        }

        setLoading([round, cls, id])
        // update datastream
        if (liveDataGenerator) {
          const liveData = liveDataGenerator({
            format,
            results: newResults,
            judgesData,
            formatOptions,
          })
          setLiveDataPreview(liveData)

          // // Searchwords: Bloc data, blocdata, _format, formatOptions
          // @ts-expect-error Hacky workaround for multiple datastreams - should come up with something permanent
          const { blocData, ...coreLiveData } = liveData
          updateDatastreams([
            { privateKey: dsPrivateKey, body: coreLiveData, customMessage: message },
            { privateKey: formatOptions?.blocDataDsKey, body: blocData },
          ])
        }

        // update db
        supabase
          .from('events')
          .update({ results: newResults })
          .eq('slug', eventSlug)
          .then(() => {
            setLoading(false)
            if (feedback !== null)
              notifications.show({
                color: 'teal',
                icon: <IconCircleCheck />,
                message: feedback ?? 'Score submitted',
              })
          })

        return newResults
      })
    },
    [
      setResults,
      setLoading,
      supabase,
      eventSlug,
      format,
      liveDataGenerator,
      judgesData,
      dsPrivateKey,
      formatOptions,
    ],
  )

  return {
    results,
    updateActive,
    updateResult,
    liveDataPreview,
    loading,
  }
}
