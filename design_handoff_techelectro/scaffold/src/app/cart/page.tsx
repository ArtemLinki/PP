"use client";

import { useEffect } from "react";
import { Box, Text, Stack, Group, Button, NumberInput, Divider } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { cart, refresh, update, remove, clear } = useCartStore();

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const empty = !cart || cart.items.length === 0;

  return (
    <Box className="te-container" py="lg">
      <Text fz={{ base: 24, sm: 32 }} fw={700} c="var(--te-text)" mb="lg">
        Корзина
      </Text>

      {empty ? (
        <Text c="dimmed">Корзина пуста. Начните с подбора в ИИ-инженере или каталоге.</Text>
      ) : (
        <Stack gap="md">
          {cart.items.map((item) => (
            <Group
              key={item.id}
              justify="space-between"
              wrap="nowrap"
              p="md"
              style={{
                background: "var(--te-surface)",
                border: "1px solid var(--te-line)",
              }}
            >
              <Stack gap={2} style={{ flex: 1 }}>
                <Text size="sm" fw={600} c="var(--te-text)">
                  {item.product?.title ?? item.productId}
                </Text>
                <Text size="xs" c="dimmed" ff="JetBrains Mono">
                  {formatPrice(item.unitPrice)} × шт.
                </Text>
              </Stack>
              <NumberInput
                value={item.quantity}
                onChange={(v) =>
                  void update({ itemId: item.id, quantity: typeof v === "number" ? v : 1 })
                }
                min={1}
                max={99}
                w={80}
                size="xs"
              />
              <Text size="sm" fw={600} c="var(--te-text)" ff="JetBrains Mono" w={120} ta="right">
                {formatPrice(item.lineTotal)}
              </Text>
              <Button
                variant="subtle"
                color="gray"
                size="xs"
                onClick={() => void remove(item.id)}
                aria-label="Удалить"
              >
                <IconTrash size={14} />
              </Button>
            </Group>
          ))}

          <Divider color="var(--te-line)" />

          <Group justify="space-between">
            <Button variant="subtle" color="gray" onClick={() => void clear()}>
              Очистить
            </Button>
            <Stack gap={4} align="flex-end">
              <Text size="xs" c="dimmed">
                Итого
              </Text>
              <Text fz="xl" fw={700} c="var(--te-text)" ff="JetBrains Mono">
                {formatPrice(cart.total)}
              </Text>
              <Button color="teal" size="md">
                Оформить заказ
              </Button>
            </Stack>
          </Group>
        </Stack>
      )}
    </Box>
  );
}
