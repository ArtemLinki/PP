import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AiMessageDto, ID } from "@/lib/dto";
import { services } from "@/lib/services";

interface AiState {
  conversationId: ID | null;
  messages: AiMessageDto[];
  sending: boolean;
  error: string | null;

  send: (prompt: string) => Promise<void>;
  cancel: () => void;
  reset: () => void;
}

// AbortController lives outside the store — not serialisable and not needed in React state
let activeController: AbortController | null = null;

export const useAiStore = create<AiState>()(
  persist(
    (set, get) => ({
      conversationId: null,
      messages: [],
      sending: false,
      error: null,

      send: async (prompt) => {
        if (!prompt.trim()) return;

        activeController = new AbortController();
        const signal = activeController.signal;

        set({ sending: true, error: null });

        const userMsg: AiMessageDto = {
          id: "tmp-" + Date.now(),
          role: "user",
          content: prompt,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ messages: [...s.messages, userMsg] }));

        try {
          const res = await services.ai.prompt(
            { prompt, conversationId: get().conversationId ?? undefined },
            signal,
          );

          if (signal.aborted) return;

          const reply: AiMessageDto = {
            ...res.reply,
            recommendations: res.toolResults?.recommendedProducts?.map((p) => ({
              product: p,
              reason: "",
              confidence: 1,
            })),
          };
          set((s) => ({
            sending: false,
            conversationId: res.conversationId,
            messages: [...s.messages, reply],
          }));
        } catch (e: any) {
          if (signal.aborted) return;
          set({ sending: false, error: e?.message ?? "Ошибка ИИ" });
        } finally {
          activeController = null;
        }
      },

      cancel: () => {
        activeController?.abort();
        activeController = null;
        // Remove the optimistic user message that hasn't received a reply
        set((s) => ({
          sending: false,
          messages: s.messages.filter((m) => !m.id.startsWith("tmp-")),
        }));
      },

      reset: () => {
        activeController?.abort();
        activeController = null;
        set({ conversationId: null, messages: [], error: null, sending: false });
      },
    }),
    {
      name: "te-ai-session",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? sessionStorage : localStorage,
      ),
      partialize: (s) => ({
        conversationId: s.conversationId,
        messages: s.messages,
      }),
    },
  ),
);
