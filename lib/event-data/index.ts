import {
  EventFormatIceSkating,
  EventResultIceSkating,
  EventLiveDataIceSkating,
} from '@/lib/event-data/ice-skating';

export type Sport = keyof SportJsonTypes;

type SportJsonTypes = {
  'ice-skating': {
    format: EventFormatIceSkating;
    results: EventResultIceSkating;
    liveData: EventLiveDataIceSkating;
  };
};

export type EventFormat<S extends Sport> = SportJsonTypes[S]['format'];
export type EventLiveData<S extends Sport> = SportJsonTypes[S]['liveData'];
export type EventResult<S extends Sport> = SportJsonTypes[S]['results'];
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
    }) & { active: { round?: string; class?: string; entrant?: number } };
