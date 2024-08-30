'use client'

import { ClimbingHeadJudge } from '@/components/scoring-table-json/climbing/head-judge'
import { ClimbingJudgeSelection } from '@/components/scoring-table-json/climbing/judge-selection'
import { ClimbingMinorJudge } from '@/components/scoring-table-json/climbing/minor-judge'
import { getBoulderingJudgeIndex } from '@/components/scoring-table-json/climbing/utils'
import { ScoringTableProps } from '@/components/scoring-table-json/scoring-table-json'
import { EventTimersProvider } from '@/components/timer/event-timers-context'
import { useSearchParams } from 'next/navigation'

export function ScoringTableJsonClimbing(props: ScoringTableProps<'climbing'>) {
  const searchParams = useSearchParams()
  const station = searchParams.get('judge')

  if (!station) {
    return <ClimbingJudgeSelection blocCount={4} />
  }

  if (station === 'head') {
    return <ClimbingHeadJudge {...props} />
  }

  const { judgesData, dsPrivateKey, timers, ...otherProps } = props
  const judgeIndex = getBoulderingJudgeIndex(station, props.formatOptions.blocCount)

  return (
    <EventTimersProvider ids={timers}>
      <ClimbingMinorJudge {...otherProps} judgeData={judgesData[judgeIndex]} station={station} />
    </EventTimersProvider>
  )
}
