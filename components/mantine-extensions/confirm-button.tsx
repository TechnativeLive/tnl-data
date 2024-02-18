'use client';

import { Button, ButtonProps } from '@mantine/core';
import { useClickOutside } from '@mantine/hooks';
import { useEffect, useMemo, useState } from 'react';

export function ConfirmButton({
  onClick,
  children,
  confirmColor = 'red',
  confirmVariant = 'filled',
  confirmMessage = 'Confirm',
  type = 'button',
  ...props
}: ButtonProps &
  Omit<
    React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
    'ref'
  > & {
    confirmColor?: ButtonProps['color'];
    confirmVariant?: ButtonProps['variant'];
    confirmMessage?: string;
  }) {
  const [inConfirmState, setInConfirmState] = useState(false);
  const [buttonType, setButtonType] = useState(type);
  const ref = useClickOutside(() => setInConfirmState(false));
  const internalOnClick = useMemo<React.MouseEventHandler<HTMLButtonElement>>(
    () =>
      inConfirmState
        ? (e) => {
            onClick?.(e);
            setInConfirmState(false);
          }
        : () => setInConfirmState(true),
    [inConfirmState, onClick],
  );

  useEffect(() => {
    setTimeout(() => setButtonType(inConfirmState ? type : 'button'), 0);
  }, [inConfirmState, type]);

  const contents = inConfirmState ? confirmMessage : children ?? 'Confirm';

  return (
    <Button
      {...props}
      key={buttonType}
      type={buttonType}
      ref={ref}
      onClick={internalOnClick}
      color={inConfirmState ? confirmColor ?? props.color : props.color}
      variant={inConfirmState ? confirmVariant ?? props.variant : props.variant}
    >
      {contents}
    </Button>
  );
}
