"use client";

import Link from "next/link";
import { Group, Text, Badge, ActionIcon, Box } from "@mantine/core";
import { IconUser, IconShoppingCart, IconSearch, IconHeart } from "@tabler/icons-react";
import { useCartStore, selectCartItemsCount, useWishlistStore, selectWishlistCount } from "@/lib/store";

const navLinks = [
  { href: "/catalog", label: "Каталог" },
  { href: "/ai", label: "ИИ-инженер" },
  { href: "/orders", label: "Заказы" },
];

export function Header() {
  const cartCount = useCartStore(selectCartItemsCount);
  const wishlistCount = useWishlistStore(selectWishlistCount);

  return (
    <Box
      component="header"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "var(--te-bg-deep)",
        borderBottom: "1px solid var(--te-line)",
        height: 56,
      }}
    >
      <div
        className="te-container"
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <Group gap="md">
          <Link href="/" style={{ textDecoration: "none" }}>
            <Group gap={8} align="center">
              <WaveMark />
              <Text c="var(--te-text)" fw={500} size="md" style={{ letterSpacing: "-0.02em" }}>
                TechElectro
              </Text>
            </Group>
          </Link>

          {/* Desktop nav */}
          <Group gap="lg" visibleFrom="sm" ml="md">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  color: "var(--te-muted)",
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                {l.label}
              </Link>
            ))}
          </Group>
        </Group>

        <Group gap="sm">
          <ActionIcon variant="subtle" color="gray" visibleFrom="sm" aria-label="Поиск">
            <IconSearch size={18} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="gray"
            aria-label="Избранное"
            component={Link}
            href="/wishlist"
            pos="relative"
            visibleFrom="sm"
          >
            <IconHeart size={18} />
            {wishlistCount > 0 && (
              <Badge
                size="xs"
                color="pink"
                variant="filled"
                pos="absolute"
                top={-4}
                right={-4}
                style={{ pointerEvents: "none" }}
              >
                {wishlistCount}
              </Badge>
            )}
          </ActionIcon>
          <ActionIcon variant="subtle" color="gray" aria-label="Профиль" component={Link} href="/account">
            <IconUser size={18} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="gray"
            aria-label="Корзина"
            component={Link}
            href="/cart"
            pos="relative"
          >
            <IconShoppingCart size={18} />
            {cartCount > 0 && (
              <Badge
                size="xs"
                color="teal"
                variant="filled"
                pos="absolute"
                top={-4}
                right={-4}
                style={{ pointerEvents: "none" }}
              >
                {cartCount}
              </Badge>
            )}
          </ActionIcon>
        </Group>
      </div>
    </Box>
  );
}

function WaveMark() {
  return (
    <svg width="22" height="14" viewBox="0 0 22 14" fill="none" aria-hidden>
      <path
        d="M1 7 Q4 1, 7 7 T13 7 T19 7"
        stroke="var(--te-accent)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
