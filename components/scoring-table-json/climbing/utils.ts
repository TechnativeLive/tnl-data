import { EventResult } from '@/lib/event-data';
import { BlocScores } from '@/lib/event-data/climbing';

export function getBlocScores(result: EventResult<'climbing'>['result'][number]): BlocScores {
  const scores: BlocScores = {
    attempts: result?.length ?? 0,
    data: result,
    climbing: false,
    top: 0,
    topProvisional: 0,
    zone: 0,
  };
  if (!result) return scores;

  for (let i = 0; i < result.length; i++) {
    const bloc = result[i];
    if (!bloc) continue;
    scores.climbing ||= bloc.startedAt !== undefined && bloc.endedAt === undefined;
    scores.topProvisional ||= bloc.topAtProvisional !== undefined ? i + 1 : 0;
    scores.top ||= bloc.topAt !== undefined ? i + 1 : 0;
    scores.zone ||= bloc.zoneAt !== undefined ? i + 1 : 0;
  }

  return scores;
}
