"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  Box,
  Text,
  Stack,
  Group,
  Button,
  SimpleGrid,
  Skeleton,
} from "@mantine/core";
import { IconHeartOff, IconTrash } from "@tabler/icons-react";
import { useWishlistStore } from "@/lib/store/useWishlistStore";
import { useServices } from "@/lib/services/ServicesProvider";
import { ProductCard } from "@/components/product/ProductCard";
import { Eyebrow } from "@/components/ui/Eyebrow";

export default function WishlistPage() {
  const { items, clear } = useWishlistStore();
  const services = useServices();

  const { data: products, isLoading } = useQuery({
    queryKey: ["wishlist-products", items],
    queryFn: async () => {
      if (items.length === 0) return [];
      const results = await Promise.allSettled(
        items.map((id) => services.products.getById(id))
      );
      return results
        .filter((r): r is PromiseFulfilledResult<any> => r.status === "fulfilled")
        .map((r) => r.value);
    },
    staleTime: 30_000,
    enabled: items.length > 0,
  });

  const isEmpty = items.length === 0;

  return (
    <Box className="te-container" py="lg">
      <Stack gap={4} mb="xl">
        <Eyebrow>ИЗБРАННОЕ</Eyebrow>
        <Group justify="space-between" align="center">
          <Text fz={{ base: 24, sm: 32 }} fw={700} c="var(--te-text)">
            Список желаний
            {!isEmpty && (
              <Text component="span" size="lg" fw={400} c="dimmed" ml="sm">
                {items.length} поз.
              </Text>
            )}
          </Text>
          {!isEmpty && (
            <Button
              variant="subtle"
              color="gray"
              size="xs"
              leftSection={<IconTrash size={12} />}
              onClick={clear}
            >
              Очистить
            </Button>
          )}
        </Group>
      </Stack>

      {isEmpty ? (
        <Stack align="center" gap="md" py={80}>
          <IconHeartOff size={64} opacity={0.2} color="var(--te-text)" />
          <Text c="dimmed" ta="center">
            Список желаний пуст. Добавляйте товары через иконку сердечка.
          </Text>
          <Button
            variant="default"
            style={{ borderColor: "var(--te-line)" }}
            component={Link}
            href="/catalog"
          >
            Перейти в каталог
          </Button>
        </Stack>
      ) : (
        <SimpleGrid cols={{ base: 1, xs: 2, sm: 3, md: 4 }} spacing="md">
          {isLoading
            ? Array.from({ length: items.length }).map((_, i) => (
                <Skeleton key={i} height={300} />
              ))
            : (products ?? []).map((p) => <ProductCard key={p.id} product={p} />)}
        </SimpleGrid>
      )}
    </Box>
  );
}
