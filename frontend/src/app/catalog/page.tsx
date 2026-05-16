"use client";

import { useQuery } from "@tanstack/react-query";
import { Box, SimpleGrid, Text, Skeleton, Stack } from "@mantine/core";
import { ProductCard } from "@/components/product/ProductCard";
import { useServices } from "@/lib/services/ServicesProvider";

export default function CatalogPage() {
  const services = useServices();
  const { data, isLoading } = useQuery({
    queryKey: ["products", { page: 1, pageSize: 24 }],
    queryFn: () => services.products.list({ page: 1, pageSize: 24 }),
  });

  return (
    <Box className="te-container" py="lg">
      <Stack gap={4} mb="lg">
        <Text size="xs" ff="JetBrains Mono" c="teal.6" style={{ letterSpacing: "0.12em" }}>
          КАТАЛОГ
        </Text>
        <Text fz={{ base: 24, sm: 32 }} fw={700} c="var(--te-text)">
          Компоненты и платы
        </Text>
      </Stack>

      <SimpleGrid cols={{ base: 1, xs: 2, sm: 3, md: 4 }} spacing="md">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} height={300} radius="md" />
            ))
          : data?.items.map((p) => <ProductCard key={p.id} product={p} />)}
      </SimpleGrid>
    </Box>
  );
}
