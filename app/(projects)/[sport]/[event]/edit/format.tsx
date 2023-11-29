import {
  depopulateFormatEntrants,
  populateFormatEntrants,
  updateFormatEntrants,
} from '@/app/(projects)/[sport]/[event]/edit/actions';
import { useFormFeedback } from '@/lib/hooks/use-form-feedback';
import { Button } from '@mantine/core';
import { IconDatabaseMinus, IconDatabasePlus, IconRefreshDot } from '@tabler/icons-react';
import { forwardRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

type Params = { sport: string; event: string };

export const PopulateEntrantsInFormat = forwardRef<
  HTMLFormElement,
  Partial<Pick<Tables<'events'>, 'format'>> & Params
>(({ event, format, sport }, ref) => {
  const [state, formAction] = useFormState(populateFormatEntrants, {
    message: null,
    success: false,
  });
  const { pending } = useFormStatus();

  useFormFeedback(state);

  return (
    <form action={formAction} ref={ref}>
      <input type="hidden" name="event" value={event} />
      <input type="hidden" name="sport" value={sport} />
      <input type="hidden" name="format" value={JSON.stringify(format)} />
      <Button
        fullWidth
        color="blue"
        variant="light"
        loading={pending}
        type="submit"
        leftSection={<IconDatabasePlus size={16} />}
      >
        Populate Entrants
      </Button>
    </form>
  );
});
PopulateEntrantsInFormat.displayName = 'PopulateEntrantsInFormat';

export const UpdateEntrantsInFormat = forwardRef<
  HTMLFormElement,
  Partial<Pick<Tables<'events'>, 'format'>> & Params
>(({ event, format, sport }, ref) => {
  const [state, formAction] = useFormState(updateFormatEntrants, {
    message: null,
    success: false,
  });
  const { pending } = useFormStatus();

  useFormFeedback(state);

  return (
    <form action={formAction} ref={ref}>
      <input type="hidden" name="event" value={event} />
      <input type="hidden" name="sport" value={sport} />
      <input type="hidden" name="format" value={JSON.stringify(format)} />
      <Button
        fullWidth
        color="blue"
        variant="light"
        loading={pending}
        type="submit"
        leftSection={<IconRefreshDot size={16} />}
      >
        Update All Entrants
      </Button>
    </form>
  );
});
UpdateEntrantsInFormat.displayName = 'UpdateEntrantsInFormat';

export const DepopulateEntrantsInFormat = forwardRef<
  HTMLFormElement,
  Partial<Pick<Tables<'events'>, 'format'>> & Params
>(({ event, format, sport }, ref) => {
  const [state, formAction] = useFormState(depopulateFormatEntrants, {
    message: null,
    success: false,
  });
  const { pending } = useFormStatus();

  useFormFeedback(state);

  return (
    <form action={formAction} ref={ref}>
      <input type="hidden" name="event" value={event} />
      <input type="hidden" name="sport" value={sport} />
      <input type="hidden" name="format" value={JSON.stringify(format)} />
      <Button
        fullWidth
        color="orange"
        variant="light"
        loading={pending}
        type="submit"
        leftSection={<IconDatabaseMinus size={16} />}
      >
        Depopulate Entrants
      </Button>
    </form>
  );
});
DepopulateEntrantsInFormat.displayName = 'DepopulateEntrantsInFormat';
