"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box } from "@mantine/core";
import {
  IconHome,
  IconCategory,
  IconSparkles,
  IconShoppingBag,
  IconUser,
} from "@tabler/icons-react";

const tabs = [
  { href: "/", label: "Главная", Icon: IconHome },
  { href: "/catalog", label: "Каталог", Icon: IconCategory },
  { href: "/ai", label: "ИИ", Icon: IconSparkles },
  { href: "/cart", label: "Корзина", Icon: IconShoppingBag },
  { href: "/account", label: "Профиль", Icon: IconUser },
];

/**
 * Нижний таб-бар. Виден только на мобилке (<sm).
 * На десктопе скрыт — там навигация в шапке.
 */
export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <Box
      component="nav"
      hiddenFrom="sm"
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        height: "calc(64px + env(safe-area-inset-bottom))",
        paddingBottom: "env(safe-area-inset-bottom)",
        background: "var(--te-bg-deep)",
        borderTop: "1px solid var(--te-line)",
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        zIndex: 40,
      }}
    >
      {tabs.map(({ href, label, Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              textDecoration: "none",
              color: active ? "var(--te-accent)" : "var(--te-muted)",
              fontSize: 11,
              fontWeight: 500,
            }}
          >
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        );
      })}
    </Box>
  );
}
