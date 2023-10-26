import { Select as MantineSelect } from '@mantine/core';
import classes from './select.module.css';

type SelectProps = React.ComponentProps<typeof MantineSelect>;

export function Select(props: SelectProps) {
  return (
    <MantineSelect
      // data={['React', 'Angular', 'Svelte', 'Vue']}
      // placeholder="Pick one"
      // label="Your favorite library/framework"
      classNames={classes}
      {...props}
    />
  );
}
