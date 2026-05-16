"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Box,
  Text,
  Stack,
  Group,
  Button,
  NumberInput,
  Divider,
  Grid,
  Badge,
  TextInput,
  ActionIcon,
  Skeleton,
} from "@mantine/core";
import { IconTrash, IconShoppingCartOff, IconArrowRight, IconTag } from "@tabler/icons-react";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/format";
import type { CartItemDto } from "@/lib/dto";

function CartItem({ item, onUpdate, onRemove }: {
  item: CartItemDto;
  onUpdate: (qty: number) => void;
  onRemove: () => void;
}) {
  const imageUrl = item.product?.images?.[0]?.url;

  return (
    <Group
      wrap="nowrap"
      gap="md"
      p="md"
      style={{
        background: "var(--te-surface)",
        border: "1px solid var(--te-line)",
      }}
    >
      <Box
        style={{
          width: 80,
          height: 80,
          flexShrink: 0,
          background: "var(--te-bg)",
          border: "1px solid var(--te-line)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {imageUrl ? (
          <Image src={imageUrl} alt={item.product?.title ?? ""} fill style={{ objectFit: "contain" }} />
        ) : (
          <Box style={{ width: "100%", height: "100%", background: "var(--te-line)" }} />
        )}
      </Box>

      <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
        <Text size="sm" fw={600} c="var(--te-text)" lineClamp={2}>
          {item.product?.title ?? item.productId}
        </Text>
        <Group gap="xs">
          {item.product?.sku && (
            <Text size="xs" c="dimmed" ff="JetBrains Mono">SKU: {item.product.sku}</Text>
          )}
        </Group>
        {item.product?.stockStatus === "out_of_stock" ? (
          <Badge color="red" size="xs" radius={0}>Нет в наличии</Badge>
        ) : item.product?.stockStatus === "low_stock" ? (
          <Badge color="orange" size="xs" radius={0}>Мало</Badge>
        ) : null}
      </Stack>

      <Group gap="sm" wrap="nowrap">
        <NumberInput
          value={item.quantity}
          onChange={(v) => onUpdate(typeof v === "number" ? v : 1)}
          min={1}
          max={99}
          w={72}
          size="xs"
          styles={{ input: { fontFamily: "JetBrains Mono, monospace", textAlign: "center" } }}
        />
        <Text size="sm" fw={600} c="var(--te-text)" ff="JetBrains Mono" w={110} ta="right" style={{ flexShrink: 0 }}>
          {formatPrice(item.lineTotal)}
        </Text>
        <ActionIcon
          variant="subtle"
          color="gray"
          size="sm"
          onClick={onRemove}
          aria-label="Удалить"
        >
          <IconTrash size={14} />
        </ActionIcon>
      </Group>
    </Group>
  );
}

import type { CartDto } from "@/lib/dto";

function SummaryPanel({ cart, loading }: { cart: CartDto | null; loading: boolean }) {
  const [promo, setPromo] = useState("");

  const subtotal = cart?.subtotal;
  const discount = cart?.discount;
  const total = cart?.total;

  return (
    <Box
      p="xl"
      style={{
        background: "var(--te-surface)",
        border: "1px solid var(--te-line)",
        position: "sticky",
        top: 80,
      }}
    >
      <Text fw={700} size="lg" c="var(--te-text)" mb="md">Итого</Text>

      <Stack gap="xs" mb="md">
        <Group justify="space-between">
          <Text size="sm" c="dimmed">Товары</Text>
          <Text size="sm" ff="JetBrains Mono" c="var(--te-text)">
            {loading ? <Skeleton w={60} h={14} /> : formatPrice(subtotal)}
          </Text>
        </Group>
        {discount && discount.amount > 0 && (
          <Group justify="space-between">
            <Text size="sm" c="dimmed">Скидка</Text>
            <Text size="sm" ff="JetBrains Mono" c="teal.5">
              −{formatPrice(discount)}
            </Text>
          </Group>
        )}
        <Group justify="space-between">
          <Text size="sm" c="dimmed">Доставка</Text>
          <Text size="sm" c="teal.5">Бесплатно</Text>
        </Group>
      </Stack>

      <Divider color="var(--te-line)" mb="md" />

      <Group justify="space-between" mb="xl">
        <Text fw={700} c="var(--te-text)">К оплате</Text>
        <Text fw={700} fz="xl" ff="JetBrains Mono" c="var(--te-text)">
          {loading ? <Skeleton w={80} h={20} /> : formatPrice(total)}
        </Text>
      </Group>

      <Group gap="xs" mb="md">
        <TextInput
          placeholder="Промокод"
          value={promo}
          onChange={(e) => setPromo(e.currentTarget.value)}
          leftSection={<IconTag size={14} />}
          size="sm"
          style={{ flex: 1 }}
          styles={{
            input: {
              background: "var(--te-bg)",
              borderColor: "var(--te-line)",
              color: "var(--te-text)",
            },
          }}
        />
        <Button variant="default" size="sm" style={{ borderColor: "var(--te-line)" }}>
          Применить
        </Button>
      </Group>

      <Button
        fullWidth
        color="teal"
        size="md"
        radius={0}
        rightSection={<IconArrowRight size={16} />}
        style={{ fontWeight: 700 }}
      >
        Оформить заказ
      </Button>

      <Group gap="xs" justify="center" mt="md">
        {["Visa", "MC", "МИР", "SBP"].map((m) => (
          <Text
            key={m}
            size="xs"
            ff="JetBrains Mono"
            c="dimmed"
            px={6}
            py={2}
            style={{ border: "1px solid var(--te-line)" }}
          >
            {m}
          </Text>
        ))}
      </Group>
    </Box>
  );
}

export default function CartPage() {
  const { cart, loading, refresh, update, remove, clear } = useCartStore();

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const empty = !cart || cart.items.length === 0;

  return (
    <Box className="te-container" py="lg">
      <Text fz={{ base: 24, sm: 32 }} fw={700} c="var(--te-text)" mb="xl">
        Корзина
        {cart && cart.items.length > 0 && (
          <Text component="span" size="lg" fw={400} c="dimmed" ml="sm">
            {cart.items.length} позиц.
          </Text>
        )}
      </Text>

      {empty && !loading ? (
        <Stack align="center" gap="md" py={80}>
          <IconShoppingCartOff size={64} color="var(--te-text)" opacity={0.2} />
          <Text c="dimmed" ta="center">
            Корзина пуста. Начните с подбора в ИИ-инженере или каталоге.
          </Text>
          <Button variant="default" style={{ borderColor: "var(--te-line)" }} component="a" href="/catalog">
            Перейти в каталог
          </Button>
        </Stack>
      ) : (
        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Stack gap="sm">
              {loading && !cart
                ? Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} h={112} radius={0} />
                  ))
                : cart?.items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdate={(qty) => void update({ itemId: item.id, quantity: qty })}
                      onRemove={() => void remove(item.id)}
                    />
                  ))}

              {cart && cart.items.length > 0 && (
                <Group justify="flex-end" mt="xs">
                  <Button
                    variant="subtle"
                    color="gray"
                    size="xs"
                    leftSection={<IconTrash size={12} />}
                    onClick={() => void clear()}
                  >
                    Очистить корзину
                  </Button>
                </Group>
              )}
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <SummaryPanel cart={cart} loading={loading} />
          </Grid.Col>
        </Grid>
      )}
    </Box>
  );
}
