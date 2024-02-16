import { EventResult } from '@/lib/event-data';

export type BlocScores = {
  climbing: boolean;
  top: number;
  topProvisional: number;
  zone: number;
  attempts: number;
};

export function getBlocScores(
  result?: EventResult<'climbing'>['result'][number],
): BlocScores | undefined {
  if (!result) return undefined;
  const scores = { attempts: result.length } as BlocScores;

  for (let i = 0; i < result.length; i++) {
    const bloc = result[i];
    scores.climbing ||= bloc.startedAt !== undefined && bloc.endedAt === undefined;
    scores.topProvisional ||= bloc.topAtProvisional !== undefined ? i + 1 : 0;
    scores.top ||= bloc.topAt !== undefined ? i + 1 : 0;
    scores.zone ||= bloc.zoneAt !== undefined ? i + 1 : 0;
  }

  return scores;
}
