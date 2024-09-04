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
export type EventResult<S extends Sport> = {
  result: SportJsonTypes[S]['results'];
  // __ts: number;
  status?: 'DNS' | 'DNF' | 'DQ';
};
export type EventResults<S extends Sport> = Results<EventResult<S>>;

type Results<Result extends unknown = unknown> = {
  [round: string]:
  | {
    [cls: string]:
    | {
      [entrant: string]: Result | undefined;
    }
    | undefined;
  }
  | undefined;
} & {
  active: { round?: string; class?: string; entrant?: number } | undefined;
  // judgeActive?:
  //   | { [station: string]: { class?: string; entrant?: number; __ts: number } }
  //   | undefined;
};

export type JudgeDataClimbing = Results<EventResultClimbing[number]> | null;
