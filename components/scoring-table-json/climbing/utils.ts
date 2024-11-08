import { EventResult } from '@/lib/event-data'
import { BlocScores } from '@/lib/event-data/climbing'

export function getBlocScores(
  result: EventResult<'climbing'>['result'][number] | undefined,
): BlocScores {
  const scores: BlocScores = {
    data: result ?? [],
    climbing: false,
    t: 0,
    z: 0,
    tp: 0,
    a: result?.length ?? 0,
  }
  if (!result) return scores

  for (let i = 0; i < result.length; i++) {
    const bloc = result[i]
    if (!bloc) continue
    scores.climbing ||= bloc.s !== undefined && bloc.e === undefined
    scores.tp ||= bloc.tp !== undefined ? i + 1 : 0
    scores.t ||= bloc.t !== undefined ? i + 1 : 0
    scores.z ||= bloc.z !== undefined ? i + 1 : 0
  }

  return scores
}

export function getBoulderingJudgeIndex(station: string, blocCount: number) {
  if (station.toLowerCase().startsWith('m')) {
    return Number(station.charAt(1)) - 1
  }
  return blocCount + Number(station.charAt(1)) - 1
}

export function getBoulderingJudgeStation(cls: string, index: number) {
  const initial = cls.charAt(0).toUpperCase()
  return `${initial}${index + 1}`
}
