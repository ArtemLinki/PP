"use client";

import { ReactNode } from "react";
import { Box } from "@mantine/core";
import { Header } from "./Header";
import { MobileBottomNav } from "./MobileBottomNav";
import { AiAssistantPill } from "@/components/ai/AiAssistantPill";

/**
 * Корневая раскладка. Mobile-first:
 *  - На мобилке: top-bar (sticky), контент, нижний таб-бар.
 *  - На десктопе: расширенный header c навигацией, нижнего таб-бара нет.
 *
 * Mantine брейкпоинты `visibleFrom`/`hiddenFrom` отвечают за переключение
 * между мобильной и десктопной версиями.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <Box
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--te-bg)",
      }}
    >
      <Header />
      <Box
        component="main"
        style={{
          flex: 1,
          paddingBottom: "calc(72px + env(safe-area-inset-bottom))",
        }}
      >
        {children}
      </Box>
      <AiAssistantPill />
      <MobileBottomNav />
    </Box>
  );
}
