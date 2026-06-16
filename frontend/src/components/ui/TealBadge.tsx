import { Badge } from '@mantine/core';
import type { ReactNode } from 'react';

export function TealBadge({ children }: { children: ReactNode }) {
  return (
    <Badge color="teal" variant="light" size="sm" ff="JetBrains Mono" style={{ letterSpacing: '0.06em' }}>
      {children}
    </Badge>
  );
}
