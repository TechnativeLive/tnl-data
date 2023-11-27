import { Text, Title } from '@mantine/core';
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
        <div className="w-full grid grid-cols-[max-content_min-content] justify-between text-sm text-dimmed pb-6">
          {stat.events
            .filter((e) => e.count > 0)
            .map((e) => (
              <Fragment key={e.label}>
                <div>{e.label}</div>
                <div className="font-bold">{e.count}</div>
              </Fragment>
            ))}
        </div>
        <Text className="shrink-0 leading-none relative">
          <span className="text-dimmed text-[0.65rem] absolute bottom-0 right-full">TOTAL</span>
          <span className="leading-none text-2xl font-bold">{stat.count}</span>
        </Text>
      </div>
      {/* <div className="flex text-gray-7 dark:text-gray-6 items-end grow">
        <div className="flex flex-col grow justify-end pb-1">
          <div className="text-sm">
            {stat.activeCount === 0 ? null : (
              <div>
                <span className="font-bold">{stat.activeCount}</span> Active
              </div>
            )}
            {stat.unknownCount === 0 ? null : (
              <div>
                <span className="font-bold">{stat.unknownCount}</span> No Dates
              </div>
            )}
          </div>
        </div>
        <Text className="shrink-0 leading-none">
          <span className="text-xs">
            / <span className="leading-none text-2xl font-bold">{stat.count}</span>
          </span>
        </Text>
      </div> */}
    </Link>
  );
}
