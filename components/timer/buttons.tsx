import { ConfirmButton } from '@/components/mantine-extensions/confirm-button';
import { useTimerControls } from '@/app/(app-shell)/timers/controls';
import { deleteTimer } from '@/lib/timer/actions';
import { timerPause, timerPlay, timerReset } from '@/lib/timer/utils';
import { Button, ButtonGroup, MantineSize } from '@mantine/core';

export function TimerControlsButtons({ size }: { size?: MantineSize }) {
  const [timer, { setTimer, sync }] = useTimerControls();

  return (
    <ButtonGroup>
      <Button
        size={size}
        fullWidth
        onClick={async () => {
          const updatedTimer = timer.isRunning ? timerPause(timer) : timerPlay(timer);
          setTimer(updatedTimer);
          sync(updatedTimer);
        }}
      >
        {timer.isRunning ? 'Pause' : 'Play'}
      </Button>
      <Button
        size={size}
        fullWidth
        onClick={async () => {
          const updatedTimer = timerReset(timer);
          setTimer(updatedTimer);
          sync(updatedTimer);
        }}
        disabled={!timer.isRunning && timer.value === 0}
      >
        {timer.isRunning ? 'Stop & Reset' : 'Reset'}
      </Button>
    </ButtonGroup>
  );
}

export function TimerControlsUpdateButton() {
  const [timer, { sync }] = useTimerControls();

  return (
    <Button
      fullWidth
      color="teal"
      variant="filled"
      onClick={() => {
        sync(timer);
      }}
    >
      Update
    </Button>
  );
}

export function TimerControlsDeleteButton() {
  const [timer] = useTimerControls();

  return (
    <ConfirmButton
      fullWidth
      onClick={async () => deleteTimer(timer.id)}
      color="red"
      variant="light"
      confirmVariant="filled"
    >
      Delete
    </ConfirmButton>
  );
}
