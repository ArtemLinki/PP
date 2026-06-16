"use client";

import Link from "next/link";
import { Box, Text } from "@mantine/core";

/**
 * Плавающий «бейдж» ИИ-инженера, как на главной из Figma.
 * Спрятан на мобилке когда есть нижний таб-бар, виден на десктопе.
 */
export function AiAssistantPill() {
  return (
    <Box
      component={Link}
      href="/ai"
      visibleFrom="sm"
      style={{
        position: "fixed",
        right: 24,
        bottom: 24,
        zIndex: 30,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 16px 10px 12px",
        background: "rgba(30,37,51,0.92)",
        border: "1px solid rgba(0,212,181,0.5)",
        boxShadow: "0 0 24px rgba(0,212,181,0.25)",
        textDecoration: "none",
        backdropFilter: "blur(8px)",
      }}
    >
      <Box
        style={{
          width: 26,
          height: 26,
          border: "1.5px solid var(--te-accent)",
          borderRadius: 2,
          display: "grid",
          placeItems: "center",
          fontFamily: "Inter",
          fontSize: 10,
          color: "var(--te-accent)",
        }}
      >
        AI
      </Box>
      <Box>
        <Text size="xs" c="var(--te-text)" lh={1}>
          ИИ-инженер
        </Text>
        <Text
          ff="JetBrains Mono"
          size="9px"
          c="var(--te-accent)"
          mt={4}
          style={{ letterSpacing: "0.05em" }}
        >
          ● отклик ~3с
        </Text>
      </Box>
    </Box>
  );
}
