'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Modal, Stack, TextInput, Text, Button, Group, Divider, Box,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconTruck } from '@tabler/icons-react';
import { useCartStore, useAuthStore } from '@/lib/store';
import { useServices } from '@/lib/services/ServicesProvider';
import { formatPrice } from '@/lib/format';
import type { CreateOrderDto } from '@/lib/dto';

interface Props {
  opened: boolean;
  onClose: () => void;
}

export function CheckoutModal({ opened, onClose }: Props) {
  const router = useRouter();
  const services = useServices();
  const user = useAuthStore((s) => s.user);
  const { cart, refresh: refreshCart } = useCartStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [prefilling, setPrefilling] = useState(false);

  // Pre-fill from last order when modal opens
  useEffect(() => {
    if (!opened || !user) return;
    setPrefilling(true);
    services.orders.getLastDelivery().then((d) => {
      if (d) {
        if (d.deliveryName) setName(d.deliveryName);
        if (d.deliveryPhone) setPhone(d.deliveryPhone);
        if (d.deliveryCity) setCity(d.deliveryCity);
        if (d.deliveryAddress) setAddress(d.deliveryAddress);
      } else if (user.name) {
        setName(user.name);
        if (user.phone) setPhone(user.phone ?? '');
      }
    }).finally(() => setPrefilling(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart || cart.items.length === 0) return;

    setLoading(true);
    try {
      const payload: CreateOrderDto = {
        items: cart.items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        delivery: {
          deliveryName: name || undefined,
          deliveryPhone: phone || undefined,
          deliveryCity: city || undefined,
          deliveryAddress: address || undefined,
        },
      };
      await services.orders.create(payload);
      await refreshCart();
      notifications.show({ title: 'Заказ оформлен!', message: 'Мы свяжемся с вами в ближайшее время', color: 'teal' });
      onClose();
      router.push('/orders');
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'message' in err
        ? String((err as { message: unknown }).message)
        : 'Не удалось оформить заказ';
      notifications.show({ title: 'Ошибка', message, color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  const total = cart?.total;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <IconTruck size={18} color="var(--te-accent)" />
          <Text fw={700} c="var(--te-text)">Оформление заказа</Text>
        </Group>
      }
      size="md"
      radius={0}
      styles={{
        content: { background: 'var(--te-surface)', border: '1px solid var(--te-line)' },
        header: { background: 'var(--te-surface)', borderBottom: '1px solid var(--te-line)' },
        title: { color: 'var(--te-text)' },
        close: { color: 'var(--te-muted)' },
      }}
    >
      <form onSubmit={(e) => void handleSubmit(e)}>
        <Stack gap="md">
          <Text size="xs" ff="JetBrains Mono" c="var(--te-muted)" style={{ letterSpacing: '0.08em' }}>
            ДАННЫЕ ДОСТАВКИ
          </Text>

          <TextInput
            label="Имя получателя"
            placeholder="Иван Иванов"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            required
            disabled={prefilling}
            styles={{ input: { background: 'var(--te-bg)', borderColor: 'var(--te-line)', color: 'var(--te-text)' } }}
          />
          <TextInput
            label="Телефон"
            placeholder="+79001234567"
            value={phone}
            onChange={(e) => setPhone(e.currentTarget.value)}
            type="tel"
            required
            disabled={prefilling}
            styles={{ input: { background: 'var(--te-bg)', borderColor: 'var(--te-line)', color: 'var(--te-text)' } }}
          />
          <TextInput
            label="Город"
            placeholder="Москва"
            value={city}
            onChange={(e) => setCity(e.currentTarget.value)}
            required
            disabled={prefilling}
            styles={{ input: { background: 'var(--te-bg)', borderColor: 'var(--te-line)', color: 'var(--te-text)' } }}
          />
          <TextInput
            label="Адрес"
            placeholder="ул. Ленина, д.1, кв.1"
            value={address}
            onChange={(e) => setAddress(e.currentTarget.value)}
            required
            disabled={prefilling}
            styles={{ input: { background: 'var(--te-bg)', borderColor: 'var(--te-line)', color: 'var(--te-text)' } }}
          />

          <Divider color="var(--te-line)" />

          {total && (
            <Box>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Позиций:</Text>
                <Text size="sm" c="var(--te-text)">{cart?.items.length ?? 0}</Text>
              </Group>
              <Group justify="space-between" mt={4}>
                <Text fw={700} c="var(--te-text)">К оплате:</Text>
                <Text fw={700} fz="lg" ff="JetBrains Mono" c="var(--te-text)">{formatPrice(total)}</Text>
              </Group>
            </Box>
          )}

          <Button
            type="submit"
            color="teal"
            fullWidth
            radius={0}
            loading={loading}
            disabled={!cart || cart.items.length === 0}
          >
            Подтвердить заказ →
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
