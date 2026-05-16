'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Text, TextInput, PasswordInput, Button, Stack,
  SegmentedControl, Checkbox, Anchor,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import type { RegisterDto } from '@/lib/dto';
import { useServices } from '@/lib/services/ServicesProvider';

export default function RegisterPage() {
  const services = useServices();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'B2C' | 'B2B'>('B2C');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      notifications.show({ title: 'Ошибка', message: 'Пароли не совпадают', color: 'red' });
      return;
    }
    if (!agreed) {
      notifications.show({ title: 'Ошибка', message: 'Необходимо согласие с условиями', color: 'red' });
      return;
    }
    setLoading(true);
    try {
      const payload: RegisterDto = { email, password, name, phone: phone || undefined, role };
      // `register` is not yet in the service interface — treated as a UI stub.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const authWithRegister = services.auth as any;
      if (typeof authWithRegister.register === 'function') {
        await authWithRegister.register(payload);
      }
      notifications.show({ title: 'Готово', message: 'Аккаунт создан. Войдите в систему.', color: 'teal' });
      router.push('/login');
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'message' in err
        ? String((err as { message: unknown }).message)
        : 'Не удалось зарегистрироваться';
      notifications.show({ title: 'Ошибка', message, color: 'red' });
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
      <Box style={{ width: '100%', maxWidth: 540 }}>
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
              Создать аккаунт
            </Text>
          </Stack>

          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              <Box>
                <Text size="xs" c="var(--te-muted)" mb={6} ff="JetBrains Mono" style={{ letterSpacing: '0.08em' }}>
                  ТИП АККАУНТА
                </Text>
                <SegmentedControl
                  value={role}
                  onChange={(v) => setRole(v as 'B2C' | 'B2B')}
                  data={[
                    { value: 'B2C', label: 'Частное лицо' },
                    { value: 'B2B', label: 'Юридическое лицо' },
                  ]}
                  fullWidth
                  color="teal"
                  styles={{ root: { background: 'var(--te-bg-deep)', borderRadius: 0 } }}
                />
              </Box>

              <TextInput
                label="ФИО"
                placeholder="Иван Иванов"
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
                required
                styles={{ input: { background: 'var(--te-bg-deep)', borderRadius: 0 } }}
              />
              <TextInput
                label="Электронная почта"
                placeholder="username@example.ru"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                type="email"
                required
                styles={{ input: { background: 'var(--te-bg-deep)', borderRadius: 0 } }}
              />
              <TextInput
                label="Телефон (необязательно)"
                placeholder="+79001234567"
                value={phone}
                onChange={(e) => setPhone(e.currentTarget.value)}
                styles={{ input: { background: 'var(--te-bg-deep)', borderRadius: 0 } }}
              />
              <PasswordInput
                label="Пароль"
                placeholder="Минимум 6 символов"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                required
                styles={{ input: { background: 'var(--te-bg-deep)', borderRadius: 0 } }}
              />
              <PasswordInput
                label="Подтвердите пароль"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.currentTarget.value)}
                required
                styles={{ input: { background: 'var(--te-bg-deep)', borderRadius: 0 } }}
              />

              <Checkbox
                checked={agreed}
                onChange={(e) => setAgreed(e.currentTarget.checked)}
                color="teal"
                label={
                  <Text size="sm" c="var(--te-muted)">
                    Согласен с{' '}
                    <Anchor href="#" c="teal.6" size="sm">условиями использования</Anchor>
                  </Text>
                }
              />

              <Button
                type="submit"
                color="teal"
                loading={loading}
                fullWidth
                style={{ borderRadius: 0, marginTop: 8 }}
                disabled={!agreed}
              >
                Создать аккаунт →
              </Button>
            </Stack>
          </form>

          <Text size="sm" c="var(--te-muted)" ta="center" mt="lg">
            Уже есть аккаунт?{' '}
            <Anchor href="/login" c="teal.6">Войти</Anchor>
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
