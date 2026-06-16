'use client';

import { useEffect, useRef, useState } from 'react';
import { Box, Text, Textarea, ActionIcon, Loader } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import { IconSend, IconPlayerStop } from '@tabler/icons-react';
import { useAiStore } from '@/lib/store';
import { AiRecommendationsBlock } from './AiRecommendationsBlock';

export function AiChatWindow() {
  const messages = useAiStore((s) => s.messages);
  const sending = useAiStore((s) => s.sending);
  const error = useAiStore((s) => s.error);
  const send = useAiStore((s) => s.send);
  const cancel = useAiStore((s) => s.cancel);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const msg = input.trim();
    if (!msg || sending) return;
    setInput('');
    void send(msg);
  };

  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 500,
      }}
    >
      {/* Messages */}
      <Box style={{ flex: 1, overflowY: 'auto', padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {messages.length === 0 && (
          <Box style={{ textAlign: 'center', padding: '48px 24px' }}>
            <Text size="10px" ff="JetBrains Mono" c="teal.6" style={{ letterSpacing: '0.12em', marginBottom: 8 }}>
              AI ENGINEER · ONLINE
            </Text>
            <Text c="var(--te-muted)" size="sm">
              Опишите проект или задайте вопрос — ИИ подберёт компоненты и добавит в корзину
            </Text>
          </Box>
        )}

        {messages.map((m) => (
          <Box
            key={m.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: m.role === 'user' ? 'flex-end' : 'flex-start',
              gap: 4,
            }}
          >
            <Text size="10px" ff="JetBrains Mono" c={m.role === 'user' ? 'dimmed' : 'teal.6'} style={{ letterSpacing: '0.08em' }}>
              {m.role === 'user' ? 'ВЫ' : 'AI'}
            </Text>
            <Box
              p="sm"
              style={{
                maxWidth: '80%',
                background: m.role === 'user' ? 'var(--te-bg-deep)' : 'var(--te-surface)',
                border: m.role === 'user'
                  ? '1px solid var(--te-accent)'
                  : '1px solid var(--te-line)',
              }}
            >
              {m.role === 'user' ? (
                <Text size="sm" c="var(--te-text)" style={{ whiteSpace: 'pre-wrap' }}>
                  {m.content}
                </Text>
              ) : (
                <Box
                  style={{
                    fontSize: 14,
                    color: 'var(--te-text)',
                    lineHeight: 1.6,
                  }}
                  className="ai-markdown"
                >
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </Box>
              )}
            </Box>
            {m.recommendations && m.recommendations.length > 0 && (
              <Box style={{ maxWidth: '90%', width: '100%' }}>
                <AiRecommendationsBlock products={m.recommendations.map((r) => r.product)} />
              </Box>
            )}
          </Box>
        ))}

        {sending && (
          <Box style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
            <Loader size="xs" color="teal" type="dots" />
            <Text size="xs" ff="JetBrains Mono" c="teal.6">ИИ думает…</Text>
          </Box>
        )}

        {error && !sending && (
          <Box
            p="sm"
            style={{
              alignSelf: 'flex-start',
              maxWidth: '80%',
              background: 'rgba(255,60,60,0.08)',
              border: '1px solid rgba(255,60,60,0.3)',
            }}
          >
            <Text size="xs" c="red.4" ff="JetBrains Mono" style={{ letterSpacing: '0.06em' }}>
              ОШИБКА
            </Text>
            <Text size="sm" c="var(--te-text)" mt={4}>
              {error}
            </Text>
          </Box>
        )}

        <div ref={bottomRef} />
      </Box>

      {/* Input */}
      <Box
        style={{
          borderTop: '1px solid var(--te-line)',
          paddingTop: 12,
          display: 'flex',
          gap: 8,
          alignItems: 'flex-end',
        }}
      >
        <Textarea
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Введите сообщение… (Enter — отправить, Shift+Enter — новая строка)"
          autosize
          minRows={1}
          maxRows={4}
          style={{ flex: 1 }}
          styles={{
            input: {
              background: 'var(--te-surface)',
              border: '1px solid var(--te-line)',
              borderRadius: 0,
              color: 'var(--te-text)',
            },
          }}
        />
        {sending ? (
          <ActionIcon
            size={44}
            color="red"
            variant="filled"
            onClick={cancel}
            style={{ borderRadius: 0, flexShrink: 0 }}
            aria-label="Остановить"
            title="Остановить генерацию"
          >
            <IconPlayerStop size={18} />
          </ActionIcon>
        ) : (
          <ActionIcon
            size={44}
            color="teal"
            variant="filled"
            onClick={handleSend}
            style={{ borderRadius: 0, flexShrink: 0 }}
            aria-label="Отправить"
          >
            <IconSend size={18} />
          </ActionIcon>
        )}
      </Box>
    </Box>
  );
}
