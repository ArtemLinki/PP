'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Text, TextInput, PasswordInput, Button, Stack, Divider, Anchor } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useAuthStore } from '@/lib/store';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      await login({ email, password });
      router.push('/');
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'message' in err
        ? String((err as { message: unknown }).message)
        : 'Неверный email или пароль';
      notifications.show({
        title: 'Ошибка входа',
        message,
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <Box style={{ width: '100%', maxWidth: 480 }}>
        <Box
          p="xl"
          style={{
            background: 'var(--te-surface)',
            border: '1px solid var(--te-line)',
          }}
        >
          <Stack gap="xs" mb="xl">
            <Text size="10px" ff="JetBrains Mono" c="teal.6" style={{ letterSpacing: '0.12em' }}>
              TECHELECTRO
            </Text>
            <Text fz={24} fw={700} c="var(--te-text)">
              Вход в аккаунт
            </Text>
          </Stack>

          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              <TextInput
                label="Электронная почта"
                placeholder="username@example.ru"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                type="email"
                required
                styles={{ input: { background: 'var(--te-bg-deep)', borderRadius: 0 } }}
              />
              <PasswordInput
                label="Пароль"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                required
                styles={{ input: { background: 'var(--te-bg-deep)', borderRadius: 0 } }}
              />
              <Button
                type="submit"
                color="teal"
                loading={loading}
                fullWidth
                style={{ borderRadius: 0, marginTop: 8 }}
              >
                Войти →
              </Button>
            </Stack>
          </form>

          <Divider label="ИЛИ" labelPosition="center" my="md" color="var(--te-line)" />

          <Stack gap="sm">
            <Button variant="default" fullWidth style={{ borderRadius: 0, background: 'var(--te-bg-deep)', border: '1px solid var(--te-line)', color: 'var(--te-text)' }}>
              <Text component="span" c="teal.6" fw={700} mr={8}>G</Text> Войти через Google
            </Button>
          </Stack>

          <Text size="sm" c="var(--te-muted)" ta="center" mt="lg">
            Нет аккаунта?{' '}
            <Anchor href="/register" c="teal.6">Зарегистрироваться</Anchor>
          </Text>
        </Box>
        <Text size="xs" c="dimmed" ta="center" mt="sm">
          Вход означает согласие с правилами платформы
        </Text>
      </Box>
    </Box>
  );
}
