'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, Text } from '@mantine/core';
import { AiChatWindow } from '@/components/ai/AiChatWindow';
import { useAiStore } from '@/lib/store';
import { Eyebrow } from '@/components/ui/Eyebrow';

export default function AiPage() {
  const searchParams = useSearchParams();
  const send = useAiStore((s) => s.send);
  const messages = useAiStore((s) => s.messages);

  // Auto-send ?q= param on first load
  useEffect(() => {
    const q = searchParams.get('q');
    if (q && messages.length === 0) {
      void send(q);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      className="te-container"
      py="lg"
      style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}
    >
      <Box mb="md">
        <Eyebrow>ИИ-ИНЖЕНЕР</Eyebrow>
        <Text fz={{ base: 20, sm: 28 }} fw={700} c="var(--te-text)" mt={4}>
          Подбор компонентов
        </Text>
      </Box>
      <Box style={{ flex: 1, overflow: 'hidden' }}>
        <AiChatWindow />
      </Box>
    </Box>
  );
}
