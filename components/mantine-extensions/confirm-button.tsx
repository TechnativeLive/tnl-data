'use client'

import { Button, ButtonProps } from '@mantine/core'
import { useMemo, useState } from 'react'

export function ConfirmButton({ onClick, children, confirmColor, confirmVariant, ...props }: ButtonProps
  & Omit<React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, 'ref'>
  & { confirmColor?: ButtonProps['color'], confirmVariant?: ButtonProps['variant'] }
) {
  const [inConfirmState, setInConfirmState] = useState(false)
  const internalOnClick = useMemo<React.MouseEventHandler<HTMLButtonElement>>(() => inConfirmState ? (e) => {
    onClick?.(e)
    setInConfirmState(false)
  } : () => setInConfirmState(true), [inConfirmState, onClick])

  const contents = inConfirmState ? 'Are you sure?' : children ?? 'Confirm'
  return <Button
    {...props}
    onClick={internalOnClick}
    color={inConfirmState ? (confirmColor ?? props.color) : props.color}
    variant={inConfirmState ? (confirmVariant ?? props.variant) : props.variant}>
    {contents}
  </Button>
}