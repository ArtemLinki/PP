import { Box, Text, Stack } from "@mantine/core";
import { AiPromptCard } from "@/components/ai/AiPromptCard";

/**
 * Главная — hero c промптом ИИ-инженера. Mobile-first: на узких экранах
 * текст и поле занимают всю ширину; на десктопе центрируется с max-width.
 */
export default function HomePage() {
  return (
    <Box className="te-container" py={{ base: 28, sm: 64 }}>
      <Stack gap="lg" align="center" maw={720} mx="auto">
        <Box style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Box w={6} h={6} bg="teal.6" />
          <Text
            ff="JetBrains Mono"
            size="10px"
            c="teal.6"
            fw={500}
            style={{ letterSpacing: "0.12em" }}
          >
            AI ENGINEER · ONLINE
          </Text>
        </Box>

        <Text
          ta="center"
          fz={{ base: 32, sm: 44 }}
          fw={700}
          c="var(--te-text)"
          style={{ letterSpacing: "-0.02em", lineHeight: 1.08, textWrap: "balance" }}
        >
          Техника, которая собирает сама себя.
          <br />
          <Text component="span" inherit c="teal.6">
            Спросите ИИ.
          </Text>
        </Text>

        <Text ta="center" c="dimmed" size="sm" maw={420} style={{ textWrap: "pretty" }}>
          Опишите проект — нейросеть подберёт совместимые компоненты.
        </Text>

        <Box w="100%" mt="md">
          <AiPromptCard />
        </Box>
      </Stack>
    </Box>
  );
}
