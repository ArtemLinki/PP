"use client";

import { Suspense, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import {
  Box,
  Text,
  Group,
  Stack,
  Badge,
  Button,
  NumberInput,
  Divider,
  Table,
  Skeleton,
  ActionIcon,
  Breadcrumbs,
  Anchor,
  Loader,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconShoppingCartPlus,
  IconHeart,
  IconHeartFilled,
  IconArrowLeft,
  IconTag,
} from "@tabler/icons-react";
import { useServices } from "@/lib/services/ServicesProvider";
import { useCartStore, useAuthStore } from "@/lib/store";
import { ReviewsSection } from "@/components/reviews/ReviewsSection";
import { useWishlistStore } from "@/lib/store/useWishlistStore";
import { formatPrice } from "@/lib/format";
import { Eyebrow } from "@/components/ui/Eyebrow";

const stockColor = {
  in_stock: "teal",
  low_stock: "orange",
  preorder: "blue",
  out_of_stock: "gray",
} as const;

const stockLabel = {
  in_stock: "В наличии",
  low_stock: "Осталось мало",
  preorder: "Предзаказ",
  out_of_stock: "Нет в наличии",
} as const;

function ProductPageSkeleton() {
  return (
    <Box className="te-container" py="lg">
      <Skeleton h={20} w={240} mb="xl" />
      <Box style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
        <Skeleton h={400} style={{ flex: "0 0 420px" }} />
        <Stack gap="md" style={{ flex: 1, minWidth: 280 }}>
          <Skeleton h={32} w="80%" />
          <Skeleton h={20} w="40%" />
          <Skeleton h={48} w="50%" />
          <Skeleton h={44} w="60%" />
          <Skeleton h={120} />
        </Stack>
      </Box>
    </Box>
  );
}

function ProductDetailContent() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const services = useServices();
  const addToCart = useCartStore((s) => s.add);
  const user = useAuthStore((s) => s.user);
  const { toggle: toggleWishlist, has: inWishlist } = useWishlistStore();
  const [qty, setQty] = useState<number>(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => services.products.getBySlug(slug),
    staleTime: 30_000,
    enabled: !!slug,
  });

  if (isLoading) return <ProductPageSkeleton />;

  if (isError || !product) {
    return (
      <Box className="te-container" py="xl">
        <Stack align="center" gap="md" py={80}>
          <Text fw={700} fz={32} c="var(--te-text)">404</Text>
          <Text c="dimmed">Товар не найден</Text>
          <Button variant="default" style={{ borderColor: "var(--te-line)" }} onClick={() => router.push("/catalog")}>
            В каталог
          </Button>
        </Stack>
      </Box>
    );
  }

  const images = product.images ?? [];
  const primaryImage = images[activeImageIndex] ?? images.find((i) => i.isPrimary) ?? images[0];
  const isWishlisted = inWishlist(product.id);
  const isOutOfStock = product.stockStatus === "out_of_stock";

  const handleAddToCart = async () => {
    if (!user) {
      notifications.show({ title: 'Требуется авторизация', message: 'Войдите в аккаунт, чтобы добавить товар в корзину', color: 'orange' });
      return;
    }
    await addToCart({ productId: product.id, quantity: qty });
    notifications.show({
      message: `${product.title} добавлен в корзину`,
      color: "teal",
    });
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product.id);
    notifications.show({
      message: isWishlisted ? "Удалено из избранного" : "Добавлено в избранное",
      color: isWishlisted ? "gray" : "pink",
    });
  };

  return (
    <Box className="te-container" py="lg">
      {/* Breadcrumbs */}
      <Breadcrumbs
        separator="/"
        mb="xl"
        styles={{ separator: { color: "var(--te-line)" } }}
      >
        <Anchor component={Link} href="/" size="xs" c="var(--te-muted)">Главная</Anchor>
        <Anchor component={Link} href="/catalog" size="xs" c="var(--te-muted)">Каталог</Anchor>
        <Text size="xs" c="var(--te-text)" truncate maw={240}>{product.title}</Text>
      </Breadcrumbs>

      <Box
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 48,
          alignItems: "start",
        }}
      >
        {/* ── Left: Image gallery ── */}
        <Box>
          {/* Main image */}
          <Box
            style={{
              position: "relative",
              height: 380,
              background: "var(--te-surface)",
              border: "1px solid var(--te-line)",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {primaryImage?.url ? (
              <Image
                src={primaryImage.url}
                alt={primaryImage.alt ?? product.title}
                fill
                style={{ objectFit: "contain", padding: 24 }}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <Box
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 13,
                  color: "var(--te-muted)",
                  textAlign: "center",
                  padding: 32,
                }}
              >
                <Text ff="JetBrains Mono" fz={11} c="var(--te-muted)">{product.sku}</Text>
                <Text fz={11} c="var(--te-muted)" mt={4}>Фото отсутствует</Text>
              </Box>
            )}

            {/* Stock badge overlay */}
            <Badge
              size="sm"
              color={stockColor[product.stockStatus]}
              variant="filled"
              style={{ position: "absolute", top: 12, left: 12 }}
              radius={0}
            >
              {stockLabel[product.stockStatus]}
            </Badge>
          </Box>

          {/* Thumbnails */}
          {images.length > 1 && (
            <Group gap="xs" mt="sm">
              {images.map((img, i) => (
                <Box
                  key={img.id}
                  onClick={() => setActiveImageIndex(i)}
                  style={{
                    width: 64,
                    height: 64,
                    position: "relative",
                    border: `2px solid ${i === activeImageIndex ? "var(--te-accent)" : "var(--te-line)"}`,
                    cursor: "pointer",
                    overflow: "hidden",
                    background: "var(--te-surface)",
                    flexShrink: 0,
                  }}
                >
                  <Image
                    src={img.url}
                    alt={img.alt ?? `Фото ${i + 1}`}
                    fill
                    style={{ objectFit: "contain", padding: 4 }}
                    sizes="64px"
                  />
                </Box>
              ))}
            </Group>
          )}
        </Box>

        {/* ── Right: Product info ── */}
        <Stack gap="lg">
          {/* Title block */}
          <Box>
            <Group gap="xs" mb={8}>
              <Eyebrow>SKU: {product.sku}</Eyebrow>
            </Group>
            <Text fz={{ base: 22, sm: 28 }} fw={700} c="var(--te-text)" lh={1.25}>
              {product.title}
            </Text>
            {product.shortDescription && (
              <Text size="sm" c="var(--te-muted)" mt={8} lh={1.5}>
                {product.shortDescription}
              </Text>
            )}
          </Box>

          {/* Rating */}
          {product.rating !== undefined && (
            <Group gap={8}>
              <Group gap={2}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Text
                    key={i}
                    fz={14}
                    c={i < Math.round(product.rating ?? 0) ? "yellow" : "var(--te-line)"}
                  >
                    ★
                  </Text>
                ))}
              </Group>
              <Text size="sm" c="var(--te-muted)" ff="JetBrains Mono">
                {product.rating.toFixed(1)}
              </Text>
              {product.reviewsCount !== undefined && (
                <Text size="xs" c="dimmed">
                  ({product.reviewsCount} отзывов)
                </Text>
              )}
            </Group>
          )}

          <Divider color="var(--te-line)" />

          {/* Price */}
          <Box>
            <Text fz={32} fw={800} c="var(--te-text)" ff="JetBrains Mono" lh={1}>
              {formatPrice(product.price)}
            </Text>
          </Box>

          {/* Stock qty */}
          {product.stockQty !== undefined && product.stockQty > 0 && (
            <Text size="xs" c="var(--te-muted)" ff="JetBrains Mono">
              На складе: {product.stockQty} шт.
            </Text>
          )}

          {/* Add to cart */}
          <Box>
            <Group gap="sm" align="flex-end">
              <Box>
                <Text size="xs" c="var(--te-muted)" mb={4}>Количество</Text>
                <NumberInput
                  value={qty}
                  onChange={(v) => setQty(typeof v === "number" ? Math.max(1, v) : 1)}
                  min={1}
                  max={product.stockQty ?? 99}
                  disabled={isOutOfStock}
                  w={90}
                  size="md"
                  radius={0}
                  styles={{
                    input: {
                      fontFamily: "JetBrains Mono, monospace",
                      textAlign: "center",
                      background: "var(--te-surface)",
                      borderColor: "var(--te-line)",
                      color: "var(--te-text)",
                    },
                  }}
                />
              </Box>
              <Button
                size="md"
                color="teal"
                radius={0}
                disabled={isOutOfStock}
                leftSection={<IconShoppingCartPlus size={18} />}
                onClick={() => void handleAddToCart()}
                style={{ flex: 1 }}
              >
                {isOutOfStock ? "Нет в наличии" : "В корзину"}
              </Button>
              <ActionIcon
                size={42}
                variant={isWishlisted ? "filled" : "default"}
                color={isWishlisted ? "pink" : undefined}
                radius={0}
                aria-label="Избранное"
                onClick={handleToggleWishlist}
                style={{ borderColor: "var(--te-line)" }}
              >
                {isWishlisted ? <IconHeartFilled size={18} /> : <IconHeart size={18} />}
              </ActionIcon>
            </Group>
          </Box>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <Group gap="xs">
              <IconTag size={12} color="var(--te-muted)" />
              {product.tags.map((tag) => (
                <Link key={tag} href={`/catalog?search=${tag}`} style={{ textDecoration: "none" }}>
                  <Badge
                    size="xs"
                    variant="outline"
                    color="gray"
                    radius={0}
                    style={{ borderColor: "var(--te-line)", color: "var(--te-muted)", cursor: "pointer" }}
                  >
                    {tag}
                  </Badge>
                </Link>
              ))}
            </Group>
          )}
        </Stack>
      </Box>

      {/* ── Specs + Description ── */}
      {(product.specs?.length > 0 || product.description) && (
        <Box mt={56}>
          <Box
            style={{
              display: "grid",
              gridTemplateColumns: product.description ? "1fr 1fr" : "1fr",
              gap: 32,
            }}
          >
            {/* Specs table */}
            {product.specs && product.specs.length > 0 && (
              <Box>
                <Text fw={700} c="var(--te-text)" mb="md" fz={16}>
                  Характеристики
                </Text>
                <Table
                  style={{ fontSize: 13 }}
                  styles={{
                    table: { borderCollapse: "collapse" },
                  }}
                >
                  <Table.Tbody>
                    {product.specs.map((spec) => (
                      <Table.Tr
                        key={spec.key}
                        style={{ borderBottom: "1px solid var(--te-line)" }}
                      >
                        <Table.Td
                          style={{
                            padding: "10px 16px 10px 0",
                            color: "var(--te-muted)",
                            fontWeight: 500,
                            width: "40%",
                            verticalAlign: "top",
                          }}
                        >
                          {spec.label}
                        </Table.Td>
                        <Table.Td
                          style={{
                            padding: "10px 0",
                            color: "var(--te-text)",
                            fontFamily: "JetBrains Mono, monospace",
                            fontSize: 12,
                          }}
                        >
                          {spec.value}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Box>
            )}

            {/* Description */}
            {product.description && (
              <Box>
                <Text fw={700} c="var(--te-text)" mb="md" fz={16}>
                  Описание
                </Text>
                <Text
                  size="sm"
                  c="var(--te-muted)"
                  lh={1.7}
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {product.description}
                </Text>
              </Box>
            )}
          </Box>
        </Box>
      )}

      {/* Reviews */}
      <ReviewsSection productId={product.id} />

      {/* Back button */}
      <Box mt={48}>
        <Button
          variant="subtle"
          color="gray"
          size="xs"
          leftSection={<IconArrowLeft size={12} />}
          onClick={() => router.back()}
        >
          Назад в каталог
        </Button>
      </Box>
    </Box>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<Box p="xl"><Loader color="teal" /></Box>}>
      <ProductDetailContent />
    </Suspense>
  );
}