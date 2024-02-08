import { Debug } from '@/components/debug';
import { ScoringTableProps } from '@/components/scoring-table/scoring-table';
import { Sport, EventFormat } from '@/lib/event-data';
import { Json } from '@/lib/db/types';
import { Alert, Text, Title, TitleOrder } from '@mantine/core';
import { IconExclamationCircle } from '@tabler/icons-react';

export function ScoringTableFallback({ format }: ScoringTableProps) {
  if (!isValidEventFormat(format, 'ice-skating'))
    return (
      <Alert color="red" icon={<IconExclamationCircle />} title="Invalid format">
        <Text className="text-sm italic">
          Please contact a member of the Technative broadcast team
        </Text>
      </Alert>
    );

  return <TieredList data={format} tiers={['rounds', 'classes', 'entrants']} />;
}

function TieredList({
  data,
  tiers,
  tierIndex: iteration = 0,
  index = 0,
}: {
  data: Json;
  tiers: string[];
  tierIndex?: number;
  index?: number;
}) {
  const currentTier = tiers[iteration];
  if (!currentTier) return <Debug label="Leaf" data={data} />;
  if (!data || typeof data !== 'object' || !(currentTier in data)) return <Debug data={data} />;

  const items = (data as any)[currentTier];
  const tieredId = [...tiers.slice(0, iteration + 1), index].join('.');

  if (!Array.isArray(items)) return <Debug data={items} />;

  const titleOrder = Math.min(iteration + 2, 5) as TitleOrder;

  return (
    <div className="bg-gray-5/5 rounded-md">
      <Title id={tieredId} order={titleOrder} className="event-header font-bold">
        {currentTier}
      </Title>
      {items.map((item: any, index) => (
        <TieredList
          key={item.id}
          data={item}
          tiers={tiers}
          tierIndex={iteration + 1}
          index={index}
        />
      ))}
    </div>
  );
}

function isValidEventFormat<S extends Sport>(
  format: Tables<'events'>['format'] | undefined,
  sport: S,
): format is EventFormat<S> {
  if (sport === 'ice-skating') {
    return !!(
      format &&
      typeof format === 'object' &&
      'rounds' in format &&
      Array.isArray(format.rounds)
    );
  }
  return false;
}
