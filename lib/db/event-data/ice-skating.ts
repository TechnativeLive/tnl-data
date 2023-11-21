export type EventDataIceSkating = {
  rounds: { id: string; kind: RoundKind; name: string; classes: RoundClass[] }[];
};

type RoundKind = 'heat';

type RoundClass = {
  id: string;
  name: string;
  active?: boolean;
  entrants: Tables<'entrants'>[] | Tables<'entrants'>['id'][];
};
