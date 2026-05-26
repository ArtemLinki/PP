"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box, Text, Stack, Group, Badge, Accordion,
  Skeleton, Button, Table,
} from "@mantine/core";
import { IconPackageOff, IconArrowLeft } from "@tabler/icons-react";
import { useServices } from "@/lib/services/ServicesProvider";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/store";
import { formatPrice } from "@/lib/format";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { OrderDto } from "@/lib/dto";

const statusColor: Record<string, string> = {
  PENDING: "gray",
  PAID: "teal",
  PROCESSING: "blue",
  SHIPPED: "indigo",
  DELIVERED: "green",
  CANCELLED: "red",
};

const statusLabel: Record<string, string> = {
  PENDING: "Ожидает",
  PAID: "Оплачен",
  PROCESSING: "Обрабатывается",
  SHIPPED: "Отправлен",
  DELIVERED: "Доставлен",
  CANCELLED: "Отменён",
};

function OrderRow({ order }: { order: OrderDto }) {
  return (
    <Accordion.Item value={order.id} style={{ borderColor: "var(--te-line)" }}>
      <Accordion.Control
        style={{ background: "var(--te-surface)", color: "var(--te-text)" }}
      >
        <Group justify="space-between" wrap="nowrap">
          <Group gap="md">
            <Text size="sm" fw={600} ff="JetBrains Mono" c="var(--te-text)">
              #{order.id.slice(0, 8).toUpperCase()}
            </Text>
            <Text size="xs" c="dimmed">
              {new Date(order.createdAt).toLocaleString("ru-RU", {
                day: "numeric", month: "short", year: "numeric",
              })}
            </Text>
            <Text size="xs" c="dimmed">
              {order.items.length} поз.
            </Text>
          </Group>
          <Group gap="md">
            <Text fw={600} ff="JetBrains Mono" c="var(--te-text)" size="sm">
              {formatPrice(order.total)}
            </Text>
            <Badge
              color={statusColor[order.status] ?? "gray"}
              variant="light"
              size="sm"
              radius={0}
            >
              {statusLabel[order.status] ?? order.status}
            </Badge>
          </Group>
        </Group>
      </Accordion.Control>

      <Accordion.Panel style={{ background: "var(--te-bg)", borderTop: "1px solid var(--te-line)" }}>
        <Table
          style={{ fontSize: 13 }}
          styles={{ th: { color: "var(--te-muted)", fontWeight: 500 }, td: { color: "var(--te-text)" } }}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Товар</Table.Th>
              <Table.Th>Кол-во</Table.Th>
              <Table.Th ta="right">Сумма</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {order.items.map((item) => (
              <Table.Tr key={item.id}>
                <Table.Td>
                  <Text size="xs" c="var(--te-text)" ff="JetBrains Mono">
                    {item.productId.slice(0, 8)}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="xs" c="dimmed">{item.quantity}</Text>
                </Table.Td>
                <Table.Td ta="right">
                  <Text size="xs" ff="JetBrains Mono" c="var(--te-text)">
                    {formatPrice(item.lineTotal)}
                  </Text>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        <Group justify="flex-end" mt="sm" pt="sm" style={{ borderTop: "1px solid var(--te-line)" }}>
          <Text size="sm" c="dimmed">Итого:</Text>
          <Text fw={700} ff="JetBrains Mono" c="var(--te-text)">{formatPrice(order.total)}</Text>
        </Group>
      </Accordion.Panel>
    </Accordion.Item>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const hydrate = useAuthStore((s) => s.hydrate);
  const services = useServices();

  useEffect(() => { void hydrate(); }, [hydrate]);

  const { data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => services.orders.list(),
    enabled: !!user,
  });

  if (!user && !isLoading) {
    return (
      <Box className="te-container" py="lg">
        <Stack align="center" gap="md" py={80}>
          <Text c="dimmed">Войдите, чтобы увидеть заказы</Text>
          <Button color="teal" onClick={() => router.push("/login")}>Войти</Button>
        </Stack>
      </Box>
    );
  }

  return (
    <Box className="te-container" py="lg">
      <Stack gap={4} mb="xl">
        <Eyebrow>ЗАКАЗЫ</Eyebrow>
        <Group justify="space-between" align="center">
          <Text fz={{ base: 24, sm: 32 }} fw={700} c="var(--te-text)">
            История заказов
          </Text>
          <Button
            variant="subtle"
            color="gray"
            size="xs"
            leftSection={<IconArrowLeft size={12} />}
            onClick={() => router.push("/account")}
          >
            Профиль
          </Button>
        </Group>
      </Stack>

      {isLoading ? (
        <Stack gap="sm">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} height={64} radius={0} />)}
        </Stack>
      ) : !data || data.length === 0 ? (
        <Stack align="center" gap="md" py={80}>
          <IconPackageOff size={64} opacity={0.2} color="var(--te-text)" />
          <Text c="dimmed">Заказов пока нет</Text>
          <Button variant="default" style={{ borderColor: "var(--te-line)" }} onClick={() => router.push("/catalog")}>
            Перейти в каталог
          </Button>
        </Stack>
      ) : (
        <Accordion variant="separated" radius={0}>
          {data.map((order) => <OrderRow key={order.id} order={order} />)}
        </Accordion>
      )}
    </Box>
  );
}
