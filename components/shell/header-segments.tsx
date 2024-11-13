'use client'

import { createBrowserClient } from '@/lib/db/client'
import { IconChevronRight, IconEdit } from '@tabler/icons-react'
import clsx from 'clsx'
import { Route } from 'next'
import Link from 'next/link'
import { useParams, usePathname, useSearchParams } from 'next/navigation'
import { Fragment, useEffect, useState } from 'react'

type Segment = { id?: string | number; slug: string; name: string } & Record<string, unknown>

export function HeaderSegments() {
  const supabase = createBrowserClient()
  const [loading, setLoading] = useState(true)
  const [segments, setSegments] = useState<(Segment | null)[]>([])
  const params = useParams()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const isLegacy = pathname.includes('legacy')

  useEffect(() => {
    ;(async () => {
      const data = await Promise.all([
        !params.sport
          ? null
          : supabase.from('sports').select('id, slug, name').eq('slug', params.sport).single(),
        !params.event
          ? null
          : supabase.from('events').select('slug, name').eq('slug', params.event).single(),
        // !params.round
        //   ? null
        //   : supabase
        //       .from('rounds')
        //       .select('id, slug, name, event:parent_event_id')
        //       .eq('slug', params.round)
        //       .eq('event', params.event)
        //       .single(),
      ])
      setSegments(data.map((query, i) => query?.data ?? null))
    })()

    setLoading(false)
  }, [params.sport, params.event, params.round, supabase])

  const isOnEditPage = pathname.endsWith('/edit')
  const isOnDebugPage = pathname.endsWith('/debug')
  const specialSemgent: Segment | null = isOnEditPage
    ? { id: '__edit', slug: 'edit', name: 'Edit' }
    : isOnDebugPage
      ? { id: '__debug', slug: 'debug', name: 'Debug' }
      : null

  const judgeParam = searchParams.get('judge')
  const judgeSegment: Segment | null = judgeParam
    ? {
        id: '__judge',
        slug: 'judge',
        searchParam: 'judge',
        name: judgeParam === 'head' ? `Head Judge` : `Judge ${judgeParam}`,
      }
    : null

  const allSegments = [...segments, specialSemgent, judgeSegment].filter((s) => !!s)

  const segmentsLength = allSegments
    .map((segment) => segment?.name.length ?? 0)
    .reduce((a, b) => a + b, 0)

  return (
    <div
      className={clsx(
        'items-center flex-wrap gap-x-2 sm:px-md grow transition-opacity flex',
        loading ? 'opacity-0' : 'opacity-100',
      )}
    >
      {allSegments.map((segment, index) => {
        const href = `/${segments
          .slice(0, index + 1)
          .filter((s) => !!s?.slug)
          .map((s) => s!.slug)
          .join('/')}`
        const hrefWithSearchParams =
          index === allSegments.length - 1 && judgeSegment ? `${href}?judge=${judgeParam}` : href

        const highlight = index === allSegments.length - 1

        return !segment ? null : (
          <Fragment key={segment.id ?? segment.slug}>
            {index > 0 && <IconChevronRight size={14} className="animate-fade" />}
            <Link
              aria-disabled={loading}
              href={
                index === 1 && isLegacy
                  ? (`${href}/legacy` as Route)
                  : (hrefWithSearchParams as Route)
              }
              className={clsx(
                'underline-offset-2 animate-fade flex items-center transition-all',
                'hover:underline hover:text-teal-5',
                highlight && 'text-violet-5 dark:text-violet-3',
                loading && 'cursor-default',
                segmentsLength > 60 ? 'text-xs md:text-sm' : 'text-xs sm:text-sm',
              )}
            >
              {segment.id === '__edit' && <IconEdit size={14} className="mr-2" />}
              {segment.name}
            </Link>
          </Fragment>
        )
      })}
    </div>
  )
}
