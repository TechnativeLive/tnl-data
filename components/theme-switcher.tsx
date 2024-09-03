'use client'

import { useMantineColorScheme, ActionIcon } from '@mantine/core'
import { IconSun, IconMoon } from '@tabler/icons-react'

export function ThemeSwitcher() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()

  return (
    <ActionIcon onClick={toggleColorScheme}>
      {colorScheme === 'dark' ? <IconSun size={14} /> : <IconMoon size={14} />}
    </ActionIcon>
  )
}
