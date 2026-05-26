import { create } from "zustand";
import type { AiMessageDto, ID } from "@/lib/dto";
import { services } from "@/lib/services";

interface AiState {
  conversationId: ID | null;
  messages: AiMessageDto[];
  sending: boolean;
  error: string | null;

  send: (prompt: string) => Promise<void>;
  reset: () => void;
}

export const useAiStore = create<AiState>((set, get) => ({
  conversationId: null,
  messages: [],
  sending: false,
  error: null,

  send: async (prompt) => {
    if (!prompt.trim()) return;
    set({ sending: true, error: null });

    // Оптимистично добавляем сообщение пользователя.
    const userMsg: AiMessageDto = {
      id: "tmp-" + Date.now(),
      role: "user",
      content: prompt,
      createdAt: new Date().toISOString(),
    };
    set((s) => ({ messages: [...s.messages, userMsg] }));

    try {
      const res = await services.ai.prompt({
        prompt,
        conversationId: get().conversationId ?? undefined,
      });
      const reply: AiMessageDto = {
        ...res.reply,
        recommendations: res.toolResults?.recommendedProducts?.map((p) => ({
          product: p,
          reason: '',
          confidence: 1,
        })),
      };
      set((s) => ({
        sending: false,
        conversationId: res.conversationId,
        messages: [...s.messages, reply],
      }));
    } catch (e) {
      set({ sending: false, error: (e as { message?: string })?.message ?? "Ошибка ИИ" });
    }
  },

  reset: () => set({ conversationId: null, messages: [], error: null }),
}));
