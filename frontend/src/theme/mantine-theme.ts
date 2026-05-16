import { createTheme, MantineColorsTuple } from '@mantine/core';

const teal: MantineColorsTuple = [
  '#e0faf7',
  '#b3f2eb',
  '#7dead0',
  '#47e2b3',
  '#1dd9a3',
  '#00d4b5',
  '#00bfa3',
  '#00a891',
  '#00917e',
  '#007a6b',
];

export const theme = createTheme({
  primaryColor: 'teal',
  colors: { teal },
  defaultRadius: 0,
  fontFamily: 'Inter, sans-serif',
  fontFamilyMonospace: 'JetBrains Mono, monospace',
  headings: {
    fontFamily: 'Space Grotesk, sans-serif',
  },
  black: '#121826',
  components: {
    Button: {
      defaultProps: {
        radius: 0,
      },
    },
    Input: {
      defaultProps: {
        radius: 0,
      },
    },
    TextInput: {
      defaultProps: {
        radius: 0,
      },
    },
  },
});
