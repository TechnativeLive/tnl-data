'use client';

import {
  type ScrollAreaAutosizeProps,
  ScrollArea,
  ScrollAreaAutosize,
  ScrollAreaProps,
} from '@mantine/core';
import { useState } from 'react';
import styles from './scroll-area-with-shadow.module.css';

export function ScrollAreaWithShadow({
  children,
  orientation = 'vertical',
  ...props
}: ScrollAreaProps & { orientation?: 'vertical' | 'horizontal' }) {
  const [scrollPosition, internalOnScrollPositionChange] = useState({ x: 0, y: 0 });
  const rootClassNames = [styles.shadowed, styles[orientation]].join(' ');

  return (
    <ScrollArea
      {...props}
      onScrollPositionChange={(position) => {
        internalOnScrollPositionChange(position);
        props.onScrollPositionChange?.(position);
      }}
      classNames={{ root: rootClassNames, scrollbar: styles.scrollbar }}
      data-shadow={scrollPosition.y > 0}
    >
      {children}
    </ScrollArea>
  );
}

export function ScrollAreaAutosizeWithShadow({ children, ...props }: ScrollAreaAutosizeProps) {
  const [scrollPosition, internalOnScrollPositionChange] = useState({ x: 0, y: 0 });

  return (
    <ScrollAreaAutosize
      {...props}
      onScrollPositionChange={(position) => {
        internalOnScrollPositionChange(position);
        props.onScrollPositionChange?.(position);
      }}
      classNames={{ root: styles.shadowed, scrollbar: styles.scrollbar }}
      data-shadow={scrollPosition.y > 0}
    >
      {children}
    </ScrollAreaAutosize>
  );
}
