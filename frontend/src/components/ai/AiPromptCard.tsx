"use client";

import { useState } from "react";
import { Box, Text, Button } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { useAiStore } from "@/lib/store";

/**
 * Карточка-промпт ИИ-инженера. Соответствует hero-блоку из Figma:
 * teal-рамка с лёгким свечением + плейсхолдер + CTA «Начать подбор».
 */
export function AiPromptCard() {
  const [value, setValue] = useState("");
  const send = useAiStore((s) => s.send);
  const sending = useAiStore((s) => s.sending);

  const submit = () => {
    if (!value.trim()) return;
    void send(value);
    setValue("");
  };

  return (
    <Box
      style={{
        background: "rgb(26,32,48)",
        border: "1.5px solid var(--te-accent)",
        boxShadow: "0 0 24px rgba(0,212,181,0.2)",
        padding: 16,
      }}
    >
      <Box style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <Box
          style={{
            width: 28,
            height: 28,
            border: "1px solid var(--te-accent)",
            display: "grid",
            placeItems: "center",
            color: "var(--te-accent)",
            fontSize: 11,
            fontFamily: "Inter",
          }}
        >
          AI
        </Box>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Опишите ваш проект…"
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "var(--te-text)",
            fontSize: 14,
            fontFamily: "Inter",
          }}
        />
      </Box>
      <Box style={{ height: 1, background: "var(--te-line)", margin: "0 -16px 14px" }} />
      <Button
        color="teal"
        radius={0}
        rightSection={<IconArrowRight size={14} />}
        onClick={submit}
        loading={sending}
        styles={{
          root: { color: "rgb(10,16,24)", fontWeight: 600 },
        }}
      >
        Начать подбор
      </Button>
    </Box>
  );
}
