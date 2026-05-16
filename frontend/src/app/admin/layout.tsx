"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Box,
  Stack,
  Group,
  Text,
  Button,
  UnstyledButton,
  Badge,
} from "@mantine/core";
import {
  IconLayoutDashboard,
  IconBox,
  IconCategory,
  IconBuildingFactory2,
  IconShoppingCart,
  IconLogout,
} from "@tabler/icons-react";
import { useAuthStore } from "@/lib/store";

const NAV_LINKS = [
  { label: "Дашборд", href: "/admin/dashboard", icon: IconLayoutDashboard },
  { label: "Товары", href: "/admin/products", icon: IconBox },
  { label: "Категории", href: "/admin/categories", icon: IconCategory },
  { label: "Бренды", href: "/admin/brands", icon: IconBuildingFactory2 },
  { label: "Заказы", href: "/admin/orders", icon: IconShoppingCart },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    if (user === null) {
      router.push("/login");
      return;
    }
    if (user.role !== "ADMIN") {
      router.push("/login");
    }
  }, [user, router]);

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <Box style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <Box
        style={{
          width: 240,
          flexShrink: 0,
          background: "var(--te-bg)",
          borderRight: "1px solid var(--te-line)",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        {/* Logo */}
        <Box style={{ padding: "20px 16px 16px", borderBottom: "1px solid var(--te-line)" }}>
          <Group gap={8}>
            <Text
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                fontSize: 20,
                color: "var(--te-accent)",
                lineHeight: 1,
              }}
            >
              TE
            </Text>
            <Badge
              color="orange"
              radius={0}
              size="sm"
              style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}
            >
              Admin
            </Badge>
          </Group>
        </Box>

        {/* Nav links */}
        <Stack gap={0} style={{ flex: 1, padding: "8px 0" }}>
          {NAV_LINKS.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <UnstyledButton
                key={href}
                onClick={() => router.push(href)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 16px",
                  borderLeft: isActive ? "3px solid var(--te-accent)" : "3px solid transparent",
                  color: isActive ? "var(--te-accent)" : "var(--te-muted)",
                  background: isActive ? "rgba(0,212,181,0.06)" : "transparent",
                  width: "100%",
                  cursor: "pointer",
                  transition: "background 0.15s, color 0.15s",
                }}
              >
                <Icon size={18} stroke={1.5} />
                <Text size="sm" fw={isActive ? 600 : 400} style={{ color: "inherit" }}>
                  {label}
                </Text>
              </UnstyledButton>
            );
          })}
        </Stack>

        {/* Bottom: user + logout */}
        <Box style={{ padding: "12px 16px", borderTop: "1px solid var(--te-line)" }}>
          <Text size="xs" style={{ color: "var(--te-muted)", marginBottom: 8 }} truncate>
            {user.email}
          </Text>
          <Button
            variant="subtle"
            color="red"
            size="xs"
            radius={0}
            leftSection={<IconLogout size={14} />}
            onClick={handleLogout}
            fullWidth
            justify="flex-start"
          >
            Выйти
          </Button>
        </Box>
      </Box>

      {/* Main area */}
      <Box
        style={{
          flex: 1,
          overflowY: "auto",
          background: "var(--te-bg)",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
