import { Text } from '@mantine/core';
import type { ReactNode } from 'react';

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <Text
      size="10px"
      ff="JetBrains Mono"
      c="teal.6"
      fw={500}
      style={{ letterSpacing: '0.12em', textTransform: 'uppercase' }}
    >
      {children}
    </Text>
  );
}
