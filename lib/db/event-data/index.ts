import { EventDataIceSkating } from '@/lib/db/event-data/ice-skating';

export type Sport = keyof _EventData;

type _EventData = {
  'ice-skating': EventDataIceSkating;
};

export type EventData<T extends keyof _EventData> = _EventData[T];
