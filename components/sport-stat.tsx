import { Text } from '@mantine/core';
import { IconQuestionMark } from '@tabler/icons-react';
import Link from 'next/link';
import { Route } from 'next';
import { PROJECT_ICONS } from '@/components/project-icons';

export type SportStatProp = {
  label: string;
  slug: string;
  count: number;
  activeCount: number;
  unknownCount: number;
};

export function SportStat({ stat }: { stat: SportStatProp }) {
  const Icon = PROJECT_ICONS[stat.slug] ?? IconQuestionMark;

  return (
    <Link
      href={stat.slug as Route}
      className="transition-all border border-button hover:bg-body-dimmed rounded-md p-md min-w-[6rem] min-h-[8rem] pt-xl flex flex-1 flex-col shadow-sm"
      key={stat.label}
    >
      <Icon size={32} className="mx-auto my-lg text-blue-6" stroke={1.5} />
      <div className="font-bold mb-2">{stat.label}</div>
      <div className="flex text-gray-6">
        <div className="flex flex-col grow justify-end pb-1">
          <div className="text-sm">
            {stat.activeCount === 0 ? null : (
              <span>
                <span className="font-bold">{stat.activeCount}</span> Active
              </span>
            )}
            {!stat.activeCount || !stat.unknownCount ? null : (
              <span className="font-bold"> / </span>
            )}
            {stat.unknownCount === 0 ? null : (
              <span>
                <span className="font-bold">{stat.unknownCount}</span> No Dates
              </span>
            )}
          </div>
        </div>
        <Text className="shrink-0 leading-none">
          <span className="text-xs">
            / <span className="leading-none text-2xl font-bold">{stat.count}</span>
          </span>
        </Text>
      </div>
    </Link>
  );
}
