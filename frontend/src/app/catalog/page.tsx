'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  Box, SimpleGrid, Text, Skeleton, Stack, RangeSlider,
  Button, Group, Loader, Pagination,
} from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { ProductCard } from '@/components/product/ProductCard';
import { DualModeSearchBar } from '@/components/search/DualModeSearchBar';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { useServices } from '@/lib/services/ServicesProvider';

function CatalogContent() {
  const services = useServices();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Читаем search реактивно из URL (DualModeSearchBar пишет ?search=...)
  const urlSearch = searchParams.get('search') ?? '';
  const [categoryId, setCategoryId] = useState(searchParams.get('categoryId') ?? '');
  const [brandIds, setBrandIds] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [page, setPage] = useState(1);

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', { urlSearch, categoryId, brandIds, priceRange, page }],
    queryFn: () =>
      services.products.list({
        search: urlSearch || undefined,
        categoryId: categoryId || undefined,
        priceMin: priceRange[0] > 0 ? priceRange[0] : undefined,
        priceMax: priceRange[1] < 500000 ? priceRange[1] : undefined,
        page,
        pageSize: 24,
      } as any),
    staleTime: 30_000,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => services.categories.list(),
    staleTime: 60_000,
  });

  const resetFilters = () => {
    setCategoryId('');
    setBrandIds([]);
    setPriceRange([0, 500000]);
    setPage(1);
    router.push('/catalog');
  };

  const activeCount = [
    urlSearch,
    categoryId,
    brandIds.length > 0 ? 'brands' : '',
    priceRange[0] > 0 || priceRange[1] < 500000 ? 'price' : '',
  ].filter(Boolean).length;

  return (
    <Box className="te-container" py="lg">
      <Stack gap={4} mb="lg">
        <Eyebrow>КАТАЛОГ</Eyebrow>
        <Text fz={{ base: 24, sm: 32 }} fw={700} c="var(--te-text)">
          Компоненты и платы
        </Text>
      </Stack>

      <Box style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        {/* Sidebar */}
        <Box
          visibleFrom="sm"
          style={{ width: 260, flexShrink: 0, position: 'sticky', top: 72 }}
        >
          <Stack gap="lg">
            <Box>
              <Text size="10px" ff="JetBrains Mono" c="var(--te-muted)" style={{ letterSpacing: '0.12em', marginBottom: 10 }}>
                КАТЕГОРИИ
              </Text>
              <Stack gap={2}>
                <Box
                  onClick={() => { setCategoryId(''); setPage(1); }}
                  style={{
                    padding: '6px 10px',
                    cursor: 'pointer',
                    color: !categoryId ? 'var(--te-accent)' : 'var(--te-muted)',
                    fontSize: 13,
                    borderLeft: !categoryId ? '2px solid var(--te-accent)' : '2px solid transparent',
                  }}
                >
                  Все товары
                </Box>
                {categories?.map((cat) => (
                  <Box
                    key={cat.id}
                    onClick={() => { setCategoryId(cat.id); setPage(1); }}
                    style={{
                      padding: '6px 10px',
                      cursor: 'pointer',
                      color: categoryId === cat.id ? 'var(--te-accent)' : 'var(--te-muted)',
                      fontSize: 13,
                      borderLeft: categoryId === cat.id ? '2px solid var(--te-accent)' : '2px solid transparent',
                    }}
                  >
                    {cat.title}
                    {cat.productCount ? (
                      <Text component="span" size="xs" c="dimmed" ml={6}>{cat.productCount}</Text>
                    ) : null}
                  </Box>
                ))}
              </Stack>
            </Box>

            <Box>
              <Group justify="space-between" mb={10}>
                <Text size="10px" ff="JetBrains Mono" c="var(--te-muted)" style={{ letterSpacing: '0.12em' }}>
                  ЦЕНА
                </Text>
                <Text size="xs" c="dimmed" ff="JetBrains Mono">
                  {Math.round(priceRange[0] / 100)}₽ — {Math.round(priceRange[1] / 100)}₽
                </Text>
              </Group>
              <RangeSlider
                value={priceRange}
                onChange={setPriceRange}
                min={0}
                max={500000}
                step={1000}
                color="teal"
                size="xs"
                label={null}
              />
            </Box>

            {activeCount > 0 && (
              <Button
                variant="outline"
                color="orange"
                size="xs"
                leftSection={<IconX size={12} />}
                onClick={resetFilters}
                style={{ borderRadius: 0 }}
              >
                Сбросить всё · {activeCount}
              </Button>
            )}
          </Stack>
        </Box>

        {/* Main content */}
        <Box style={{ flex: 1, minWidth: 0 }}>
          <Box mb="md">
            <DualModeSearchBar />
          </Box>

          <Group justify="space-between" mb="md">
            <Text size="sm" c="var(--te-muted)">
              {products ? (
                <>{products.total} <Text component="span" c="dimmed">результатов</Text></>
              ) : (
                <Skeleton height={16} width={100} />
              )}
            </Text>
          </Group>

          <SimpleGrid cols={{ base: 1, xs: 2, sm: 2, md: 3, lg: 4 }} spacing="md">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} height={300} />
                ))
              : products?.items.map((p) => <ProductCard key={p.id} product={p} />)}
          </SimpleGrid>

          {products && products.total === 0 && (
            <Box style={{ textAlign: 'center', padding: '60px 0' }}>
              <Text c="var(--te-muted)">Ничего не найдено. Попробуйте изменить фильтры.</Text>
            </Box>
          )}

          {products && products.total > 24 && (
            <Group justify="center" mt="xl">
              <Pagination
                total={Math.ceil(products.total / 24)}
                value={page}
                onChange={(p) => {
                  setPage(p);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                color="teal"
                radius={0}
                styles={{ control: { borderColor: 'var(--te-line)' } }}
              />
            </Group>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<Box p="xl"><Loader color="teal" /></Box>}>
      <CatalogContent />
    </Suspense>
  );
}
