'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, TextInput, ActionIcon, Tooltip } from '@mantine/core';
import { IconSearch, IconBrain } from '@tabler/icons-react';

interface Props {
  initialMode?: 'search' | 'ai';
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  initialValue?: string;
}

export function DualModeSearchBar({ initialMode = 'search', placeholder, size = 'md', initialValue = '' }: Props) {
  const [mode, setMode] = useState<'search' | 'ai'>(initialMode);
  const [value, setValue] = useState(initialValue);
  const router = useRouter();

  const submit = () => {
    const q = value.trim();
    if (mode === 'search') {
      router.push(q ? `/catalog?search=${encodeURIComponent(q)}` : '/catalog');
    } else {
      if (!q) return;
      router.push(`/ai?q=${encodeURIComponent(q)}`);
    }
  };

  const placeholderText = placeholder ?? (mode === 'search'
    ? 'Поиск по названию, параметру или интерфейсу…'
    : 'Опишите ваш проект — ИИ подберёт компоненты…');

  return (
    <Box style={{ display: 'flex', gap: 0, width: '100%' }}>
      <TextInput
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        placeholder={placeholderText}
        size={size}
        leftSection={<IconSearch size={16} color="var(--te-muted)" />}
        style={{ flex: 1 }}
        styles={{
          input: {
            background: 'var(--te-surface)',
            border: '1px solid var(--te-line)',
            borderRight: 'none',
            borderRadius: 0,
            color: 'var(--te-text)',
            '&::placeholder': { color: 'var(--te-muted)' },
          },
        }}
      />
      <Tooltip label={mode === 'search' ? 'Переключить в AI-режим' : 'Переключить в поиск'}>
        <ActionIcon
          size={size === 'sm' ? 36 : size === 'lg' ? 52 : 44}
          variant={mode === 'ai' ? 'filled' : 'default'}
          color={mode === 'ai' ? 'teal' : 'gray'}
          onClick={() => setMode((m) => (m === 'search' ? 'ai' : 'search'))}
          style={{
            borderRadius: 0,
            borderLeft: 'none',
            background: mode === 'ai' ? 'var(--te-accent)' : 'var(--te-surface)',
            border: '1px solid var(--te-line)',
            color: mode === 'ai' ? '#0a1018' : 'var(--te-muted)',
            fontFamily: 'Inter',
            fontWeight: 700,
            fontSize: 11,
            flexShrink: 0,
          }}
          aria-label="Переключить режим поиска"
        >
          <IconBrain size={18} />
        </ActionIcon>
      </Tooltip>
      <ActionIcon
        size={size === 'sm' ? 36 : size === 'lg' ? 52 : 44}
        onClick={submit}
        style={{
          borderRadius: 0,
          background: 'var(--te-accent)',
          color: '#0a1018',
          flexShrink: 0,
        }}
        aria-label="Отправить"
      >
        <IconSearch size={16} />
      </ActionIcon>
    </Box>
  );
}
