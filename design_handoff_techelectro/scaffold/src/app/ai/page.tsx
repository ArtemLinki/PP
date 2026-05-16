"use client";

import { Box, Stack, Text, Group, Card } from "@mantine/core";
import { AiPromptCard } from "@/components/ai/AiPromptCard";
import { ProductCard } from "@/components/product/ProductCard";
import { useAiStore } from "@/lib/store";

export default function AiPage() {
  const messages = useAiStore((s) => s.messages);

  return (
    <Box className="te-container" py="lg">
      <Stack gap="lg" maw={920} mx="auto">
        <Text fz={{ base: 24, sm: 32 }} fw={700} c="var(--te-text)">
          ИИ-инженер
        </Text>

        <AiPromptCard />

        {messages.length > 0 && (
          <Stack gap="md">
            {messages.map((m) => (
              <Card
                key={m.id}
                p="md"
                withBorder
                style={{
                  background: m.role === "user" ? "var(--te-bg-deep)" : "var(--te-surface)",
                  borderColor: "var(--te-line)",
                }}
              >
                <Group gap="xs" mb="xs">
                  <Text size="xs" ff="JetBrains Mono" c={m.role === "user" ? "dimmed" : "teal.6"}>
                    {m.role === "user" ? "ВЫ" : "AI"}
                  </Text>
                </Group>
                <Text size="sm" c="var(--te-text)">
                  {m.content}
                </Text>

                {m.recommendations && m.recommendations.length > 0 && (
                  <Box
                    mt="md"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                      gap: 12,
                    }}
                  >
                    {m.recommendations.map((rec) => (
                      <ProductCard key={rec.product.id} product={rec.product} />
                    ))}
                  </Box>
                )}
              </Card>
            ))}
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
