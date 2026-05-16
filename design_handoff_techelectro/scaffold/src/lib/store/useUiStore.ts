import { create } from "zustand";

/**
 * UI-стор: текущий брейкпоинт, открытость дровера, тема и т.п.
 * Сюда складываем всё чисто-визуальное состояние, которое не имеет смысла
 * персистить или ходить за ним на сервер.
 */
interface UiState {
  isMobileNavOpen: boolean;
  isAiOpen: boolean;
  theme: "dark" | "light";

  openMobileNav: () => void;
  closeMobileNav: () => void;
  toggleAi: () => void;
  setAi: (open: boolean) => void;
  setTheme: (t: "dark" | "light") => void;
}

export const useUiStore = create<UiState>((set) => ({
  isMobileNavOpen: false,
  isAiOpen: false,
  theme: "dark",

  openMobileNav: () => set({ isMobileNavOpen: true }),
  closeMobileNav: () => set({ isMobileNavOpen: false }),
  toggleAi: () => set((s) => ({ isAiOpen: !s.isAiOpen })),
  setAi: (open) => set({ isAiOpen: open }),
  setTheme: (theme) => set({ theme }),
}));
