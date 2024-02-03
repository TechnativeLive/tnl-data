import { Drawer, DrawerProps } from '@mantine/core';
import classes from './drawer.module.css';

export function DrawerAutoHeight({ onClick, children, ...props }: DrawerProps) {
  return <Drawer classNames={{ content: classes.content, title: classes.title }} {...props}>{children}</Drawer>
}