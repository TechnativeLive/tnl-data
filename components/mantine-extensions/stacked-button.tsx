import { Button, ButtonProps, createPolymorphicComponent } from '@mantine/core';
import styles from './stacked-button.module.css';
import clsx from 'clsx';
import { forwardRef } from 'react';

type StackedButtonProps = Omit<ButtonProps, 'classNames'> & { outerClassName?: string };

export const StackedButton = createPolymorphicComponent<'button', StackedButtonProps>(
  // eslint-disable-next-line react/display-name
  forwardRef<HTMLButtonElement, StackedButtonProps>(
    ({ className, outerClassName, ...props }, ref) => (
      <Button
        className={clsx(outerClassName, props.disabled && 'pointer-events-none')}
        classNames={{
          root: styles.root,
          label: clsx('flex flex-col', className, !className && 'py-2 justify-center'),
        }}
        {...props}
        ref={ref}
      />
    ),
  ),
);
StackedButton.displayName = 'StackedButton';
