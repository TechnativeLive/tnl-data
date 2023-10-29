'use client';
import { useMantineColorScheme, ActionIcon } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { useEffect, useRef } from 'react';

export function ThemeSwitcher() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return !isMounted.current ? null : (
    <ActionIcon onClick={toggleColorScheme} className="animate-fade animate-duration-300">
      {colorScheme === 'dark' ? <IconSun size={14} /> : <IconMoon size={14} />}
    </ActionIcon>
  );
}
