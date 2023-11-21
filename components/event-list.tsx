import { Stack, Title } from '@mantine/core';

export function EventList<T extends { href: string; id: string | number }>({
  label,
  data,
  row: Row,
}: {
  label: string;
  data: T[];
  row: React.ComponentType<T>;
}) {
  return (
    <Stack w="100%" maw={800} mx="lg">
      <Title order={2}>{label}</Title>
      <div className="flex flex-col border-l-4 rounded-bl-2xl rounded-tl-sm pl-2 pb-2 border-blue-4">
        {data.map((item) => (
          <Row key={item.id} {...item} />
        ))}
      </div>
    </Stack>
  );
}
