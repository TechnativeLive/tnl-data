'use client';

import {
  depopulateFormatEntrants,
  populateFormatEntrants,
  updateFormatEntrants,
} from '@/app/(app-shell)/[sport]/[event]/edit/utils';
import { Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconDatabaseMinus, IconDatabasePlus, IconRefreshDot } from '@tabler/icons-react';
import { forwardRef, useState } from 'react';

type Params = { sport: string; event: string };
type FormatUtilsProps = Params & {
  format?: string;
  setFormat: React.Dispatch<React.SetStateAction<string>>;
  method: 'populate' | 'update' | 'depopulate';
};

const methods = {
  populate: populateFormatEntrants,
  update: updateFormatEntrants,
  depopulate: depopulateFormatEntrants,
} satisfies Record<FormatUtilsProps['method'], unknown>;
const icons = {
  populate: IconDatabasePlus,
  update: IconRefreshDot,
  depopulate: IconDatabaseMinus,
} satisfies Record<FormatUtilsProps['method'], unknown>;

export const FormatUtilsButton = forwardRef<HTMLButtonElement, FormatUtilsProps>(
  ({ method, setFormat, ...props }, ref) => {
    const [loading, setLoading] = useState(false);
    const Icon = icons[method];

    return (
      <Button
        ref={ref}
        color="blue"
        variant="light"
        loading={loading}
        onClick={async () => {
          setLoading(true);
          const { success, message, data } = await methods[method](props);
          setLoading(false);
          if (!success) {
            notifications.show({
              title: 'Error',
              color: 'red',
              message,
            });
            return;
          }
          setFormat(data);
        }}
        type="submit"
        leftSection={<Icon size={16} />}
        className="capitalize"
      >
        {method} Entrants
      </Button>
    );
  },
);
FormatUtilsButton.displayName = 'FormatUtilsButton';
