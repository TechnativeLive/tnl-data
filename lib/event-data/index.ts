import {
  EventFormatClimbing,
  EventResultClimbing,
  EventLiveDataClimbing,
  EventFormatOptionsClimbing,
  roundKindClimbingSelection,
} from '@/lib/event-data/climbing';
import {
  EventFormatIceSkating,
  EventResultIceSkating,
  EventLiveDataIceSkating,
  roundKindIceSkatingSelection,
} from '@/lib/event-data/ice-skating';

export const roundKindSelection = {
  climbing: roundKindClimbingSelection,
  'ice-skating': roundKindIceSkatingSelection,
};

export type Sport = keyof SportJsonTypes;

type SportJsonTypes = {
  climbing: {
    format: EventFormatClimbing;
    formatOptions: EventFormatOptionsClimbing;
    results: EventResultClimbing;
    liveData: EventLiveDataClimbing;
  };
  'ice-skating': {
    format: EventFormatIceSkating;
    formatOptions: null | undefined;
    results: EventResultIceSkating;
    liveData: EventLiveDataIceSkating;
  };
};

export type EventFormat<S extends Sport> = SportJsonTypes[S]['format'];
export type EventFormatOptions<S extends Sport> = SportJsonTypes[S]['formatOptions'];
export type EventLiveData<S extends Sport> = SportJsonTypes[S]['liveData'];
export type EventResult<S extends Sport> = { result: SportJsonTypes[S]['results']; __ts: number };
export type EventResults<S extends Sport, Exact extends boolean = false> = Results<
  EventResult<S>,
  Exact
>;

type Results<Result extends unknown = unknown, Exact extends boolean = false> = (Exact extends true
  ? {
      [round: string]: {
        [cls: string]: {
          [entrant: string]: Result;
        };
      };
    }
  : {
      [round: string]:
        | {
            [cls: string]:
              | {
                  [entrant: string]: Result | undefined;
                }
              | undefined;
          }
        | undefined;
    }) & { active?: { round?: string; class?: string; entrant?: number; __ts: number } };
