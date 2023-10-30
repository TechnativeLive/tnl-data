import { Stack, Title } from '@mantine/core';
import { Route } from 'next';
import Link from 'next/link';

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
    <Stack w="100%" maw={800}>
      <Title>{label}</Title>
      {data.map((item) => (
        <Link
          href={item.href as Route}
          key={item.id}
          className="active border bg-button rounded-lg px-3 py-1 flex"
        >
          <Row {...item} />
        </Link>
      ))}
    </Stack>
  );
}
