'use client';

import { Box, Text, Card, Button } from '@mantine/core';
import Link from 'next/link';
import type { ProductDto } from '@/lib/dto';
import { formatPrice } from '@/lib/format';
import { useCartStore } from '@/lib/store';

interface Props {
  products: ProductDto[];
}

export function AiRecommendationsBlock({ products }: Props) {
  const addToCart = useCartStore((s) => s.add);

  if (!products.length) return null;

  return (
    <Box mt="sm">
      <Text size="10px" ff="JetBrains Mono" c="teal.6" style={{ letterSpacing: '0.12em', marginBottom: 8 }}>
        ПОДОБРАНО ДЛЯ ВАС
      </Text>
      <Box
        style={{
          display: 'flex',
          gap: 12,
          overflowX: 'auto',
          paddingBottom: 4,
        }}
      >
        {products.map((p) => (
          <Card
            key={p.id}
            withBorder
            padding="sm"
            style={{
              minWidth: 200,
              maxWidth: 220,
              flexShrink: 0,
              background: 'var(--te-bg-deep)',
              borderColor: 'var(--te-line)',
            }}
          >
            <Box
              style={{
                height: 80,
                background: 'linear-gradient(135deg, rgba(0,212,181,0.06), rgba(255,140,66,0.04))',
                display: 'grid',
                placeItems: 'center',
                fontFamily: 'JetBrains Mono',
                fontSize: 10,
                color: 'var(--te-muted)',
                marginBottom: 8,
              }}
            >
              {p.sku}
            </Box>
            <Text size="xs" fw={600} c="var(--te-text)" lineClamp={2} mb={4}>
              {p.title}
            </Text>
            <Text size="xs" ff="JetBrains Mono" c="teal.6" fw={700} mb={8}>
              {formatPrice(p.price)}
            </Text>
            <Box style={{ display: 'flex', gap: 4 }}>
              <Button
                size="xs"
                variant="light"
                color="teal"
                style={{ flex: 1, padding: '0 8px' }}
                onClick={() => void addToCart({ productId: p.id, quantity: 1 })}
              >
                В корзину
              </Button>
              <Button
                size="xs"
                variant="subtle"
                color="gray"
                component={Link}
                href={`/catalog/${p.slug}`}
                style={{ padding: '0 8px' }}
              >
                →
              </Button>
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
