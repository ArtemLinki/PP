import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface WishlistState {
  items: string[];
  toggle: (productId: string) => void;
  has: (productId: string) => boolean;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      toggle: (productId) => {
        set((s) => ({
          items: s.items.includes(productId)
            ? s.items.filter((id) => id !== productId)
            : [...s.items, productId],
        }));
      },

      has: (productId) => get().items.includes(productId),

      clear: () => set({ items: [] }),
    }),
    {
      name: "techelectro.wishlist",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export const selectWishlistCount = (s: WishlistState): number => s.items.length;