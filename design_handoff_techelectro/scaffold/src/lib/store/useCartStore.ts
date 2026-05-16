import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartDto, AddToCartDto, UpdateCartItemDto, ID } from "@/lib/dto";
import { services } from "@/lib/services";

/**
 * Стор корзины. Хранит снэпшот серверной корзины + флаги загрузки.
 * Все мутации идут через сервис — это даёт единый код для моков и реального API.
 *
 * Persist: храним только id корзины и items. На монтировании всё равно делаем
 * refresh(), чтобы получить актуальные цены.
 */
interface CartState {
  cart: CartDto | null;
  loading: boolean;
  error: string | null;

  refresh: () => Promise<void>;
  add: (payload: AddToCartDto) => Promise<void>;
  update: (payload: UpdateCartItemDto) => Promise<void>;
  remove: (itemId: ID) => Promise<void>;
  clear: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: null,
      loading: false,
      error: null,

      refresh: async () => {
        set({ loading: true, error: null });
        try {
          const cart = await services.cart.getCurrent();
          set({ cart, loading: false });
        } catch (e) {
          set({ loading: false, error: extractMessage(e) });
        }
      },

      add: async (payload) => {
        set({ loading: true, error: null });
        try {
          const cart = await services.cart.addItem(payload);
          set({ cart, loading: false });
        } catch (e) {
          set({ loading: false, error: extractMessage(e) });
        }
      },

      update: async (payload) => {
        set({ loading: true });
        try {
          const cart = await services.cart.updateItem(payload);
          set({ cart, loading: false });
        } catch (e) {
          set({ loading: false, error: extractMessage(e) });
        }
      },

      remove: async (itemId) => {
        set({ loading: true });
        try {
          const cart = await services.cart.removeItem(itemId);
          set({ cart, loading: false });
        } catch (e) {
          set({ loading: false, error: extractMessage(e) });
        }
      },

      clear: async () => {
        set({ loading: true });
        try {
          const cart = await services.cart.clear();
          set({ cart, loading: false });
        } catch (e) {
          set({ loading: false, error: extractMessage(e) });
        }
      },
    }),
    {
      name: "techelectro.cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ cart: s.cart }),
    },
  ),
);

/** Селектор: количество позиций в корзине (для бейджа на иконке). */
export const selectCartItemsCount = (s: CartState): number =>
  s.cart?.items.reduce((acc, i) => acc + i.quantity, 0) ?? 0;

function extractMessage(e: unknown): string {
  if (typeof e === "object" && e && "message" in e) {
    return String((e as { message: unknown }).message);
  }
  return "Неизвестная ошибка";
}
