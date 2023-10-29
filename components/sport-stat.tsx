import { Paper, Text } from '@mantine/core';
import classes from './sport-stat.module.css';
import { Icon as TablerIcon, IconIceSkating, IconQuestionMark } from '@tabler/icons-react';
import Link from 'next/link';
import clsx from 'clsx';
import { Route } from 'next';

export type SportStatProp = {
  label: string;
  slug: string;
  count: number;
  activeCount: number;
  unknownCount: number;
};

const ICONS: Record<string, TablerIcon> = {
  'ice-skating': IconIceSkating,
};

export function SportStat({ stat }: { stat: SportStatProp }) {
  const Icon = ICONS[stat.slug] ?? IconQuestionMark;

  return (
    <Paper
      component={Link}
      href={stat.slug as Route}
      className={clsx('transition-all', classes.stat)}
      radius="md"
      p="md"
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
    </Paper>
  );
}
