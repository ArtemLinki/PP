"use client";

import { Card, Text, Badge, Group, Button, Stack } from "@mantine/core";
import { IconShoppingCartPlus } from "@tabler/icons-react";
import type { ProductDto } from "@/lib/dto";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/lib/store";

const stockColor: Record<ProductDto["stockStatus"], string> = {
  in_stock: "teal",
  low_stock: "orange",
  preorder: "blue",
  out_of_stock: "gray",
};

const stockLabel: Record<ProductDto["stockStatus"], string> = {
  in_stock: "В наличии",
  low_stock: "Мало",
  preorder: "Предзаказ",
  out_of_stock: "Нет",
};

export function ProductCard({ product }: { product: ProductDto }) {
  const addToCart = useCartStore((s) => s.add);

  return (
    <Card
      withBorder
      padding="md"
      style={{
        background: "var(--te-surface)",
        borderColor: "var(--te-line)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Card.Section
        style={{
          height: 140,
          background:
            "linear-gradient(135deg, rgba(0,212,181,0.05), rgba(255,140,66,0.04))",
          borderBottom: "1px solid var(--te-line)",
          display: "grid",
          placeItems: "center",
          fontFamily: "JetBrains Mono",
          fontSize: 11,
          color: "var(--te-muted)",
        }}
      >
        {product.sku}
      </Card.Section>

      <Stack gap={6} mt="sm" style={{ flex: 1 }}>
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Text size="sm" fw={600} c="var(--te-text)" lineClamp={2}>
            {product.title}
          </Text>
          <Badge size="xs" color={stockColor[product.stockStatus]} variant="light">
            {stockLabel[product.stockStatus]}
          </Badge>
        </Group>
        {product.shortDescription && (
          <Text size="xs" c="dimmed" lineClamp={2}>
            {product.shortDescription}
          </Text>
        )}
      </Stack>

      <Group justify="space-between" align="center" mt="md">
        <div>
          <Text size="lg" fw={700} c="var(--te-text)" ff="JetBrains Mono">
            {formatPrice(product.price)}
          </Text>
          {product.oldPrice && (
            <Text size="xs" c="dimmed" td="line-through">
              {formatPrice(product.oldPrice)}
            </Text>
          )}
        </div>
        <Button
          size="xs"
          color="teal"
          variant="light"
          leftSection={<IconShoppingCartPlus size={14} />}
          onClick={() => void addToCart({ productId: product.id, quantity: 1 })}
        >
          В корзину
        </Button>
      </Group>
    </Card>
  );
}
