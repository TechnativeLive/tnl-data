import { QueryLink } from '@/components/query-link';
import { Button, Divider, SimpleGrid } from '@mantine/core';
import clsx from 'clsx';

export function ClimbingJudgeSelection({ blocCount }: { blocCount: number }) {
  const judges = Array.from({ length: blocCount }, (_, i) => i + 1);

  return (
    <SimpleGrid cols={4}>
      <JudgeSelectButton head />
      <Divider className="col-span-full" />
      {judges.map((position) => (
        <JudgeSelectButton class="mens" position={position} key={position} />
      ))}
      <Divider className="col-span-full" />
      {judges.map((position) => (
        <JudgeSelectButton class="womens" position={position} key={position} />
      ))}
    </SimpleGrid>
  );
}

type HeadJudge = {
  head: true;
  class?: never;
  position?: never;
};
type MinorJudge = {
  class: string;
  position: string | number;
  head?: never;
};

function JudgeSelectButton({ class: cls, position, head }: HeadJudge | MinorJudge) {
  return (
    <Button
      component={QueryLink}
      query={{ judge: head ? 'head' : `${cls.charAt(0).toUpperCase()}${position}` }}
      className={clsx('!h-[unset] py-2 px-4 tracking-widest font-mono', head && 'col-span-full')}
    >
      <div className="flex flex-col text-lg leading-none uppercase">
        <div className="mt-1">{head ? 'head' : cls}</div>
        <div className="text-3xl">{head ? 'JUDGE' : position}</div>
      </div>
    </Button>
  );
}
