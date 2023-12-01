import { Divider, Text, Title } from '@mantine/core';
import { IconQuestionMark } from '@tabler/icons-react';
import Link from 'next/link';
import { Route } from 'next';
import { PROJECT_ICONS } from '@/components/project-icons';
import { Fragment } from 'react';

export type SportStatProp = {
  label: string;
  slug: string;
  count: number;
  events: { label: string; count: number }[];
};

export function SportStat({ stat }: { stat: SportStatProp }) {
  const Icon = PROJECT_ICONS[stat.slug] ?? IconQuestionMark;
  const counts = stat.events.filter((e) => e.count > 0);

  return (
    <Link
      href={stat.slug as Route}
      className="transition-all border border-button hover:bg-body-dimmed rounded-md p-md min-w-[6rem] min-h-[8rem] flex flex-1 flex-col shadow-sm"
      key={stat.label}
    >
      <Title order={4} className="capitalize">
        {stat.label}
      </Title>
      <Icon size={32} className="mx-auto my-lg text-blue-6" stroke={1.5} />
      <div className="flex gap-2 items-end">
        <div className="w-full grid grid-cols-[max-content_min-content] justify-between text-sm text-dimmed">
          {counts.map((e) => (
            <Fragment key={e.label}>
              <div>{e.label}</div>
              <div className="font-bold">{e.count}</div>
            </Fragment>
          ))}
          {counts.length <= 1 ? null : (
            <>
              <Divider className="col-span-2" />
              <div className="font-bold col-start-2">{stat.count}</div>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
