import { Select as MantineSelect } from '@mantine/core';
import classes from './select.module.css';

type SelectProps = React.ComponentProps<typeof MantineSelect> & { surround?: boolean };

export function Select({ surround = false, ...props }: SelectProps) {
  return <MantineSelect data-surround={surround.valueOf()} classNames={classes} {...props} />;
}
