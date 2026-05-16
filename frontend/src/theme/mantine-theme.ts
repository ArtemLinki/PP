import { createTheme, MantineColorsTuple } from "@mantine/core";

/**
 * Палитра выводится из Figma:
 *   accent  rgb(0,212,181)  — фирменный teal
 *   bg-deep rgb(18,24,38)   — основной тёмный фон
 *   bg-card rgb(30,37,51)   — поверхности (карточки, инпуты)
 *   text    rgb(232,238,245)
 *   muted   rgb(139,149,168)
 *   danger  rgb(255,140,66) — оранжевый акцент
 */

const teal: MantineColorsTuple = [
  "#e6fbf6",
  "#c5f5ea",
  "#9eecd9",
  "#73e3c8",
  "#4ddbb8",
  "#26d3a9",
  "#00d4b5",
  "#00a991",
  "#007e6c",
  "#005247",
];

const ink: MantineColorsTuple = [
  "#f4f6fa",
  "#e8eef5",
  "#cdd3df",
  "#9aa4b8",
  "#6b7588",
  "#4a5468",
  "#2a3344",
  "#1e2533",
  "#121826",
  "#0f1219",
];

const flame: MantineColorsTuple = [
  "#fff1e6",
  "#ffd9bf",
  "#ffbf94",
  "#ffa56a",
  "#ff8c42",
  "#ff7321",
  "#e85f10",
  "#b54a0a",
  "#823406",
  "#501f03",
];

export const techElectroTheme = createTheme({
  primaryColor: "teal",
  primaryShade: 6,
  colors: { teal, ink, flame },

  defaultRadius: "sm",
  fontFamily: "Inter, system-ui, -apple-system, sans-serif",
  fontFamilyMonospace: "'JetBrains Mono', ui-monospace, monospace",
  headings: {
    fontFamily: "'Space Grotesk', Inter, sans-serif",
    fontWeight: "700",
  },

  breakpoints: {
    xs: "30em",
    sm: "48em",
    md: "64em",
    lg: "75em",
    xl: "90em",
  },

  components: {
    Button: {
      defaultProps: { radius: "sm" },
    },
    Card: {
      defaultProps: { radius: "md", withBorder: true },
    },
  },
});
