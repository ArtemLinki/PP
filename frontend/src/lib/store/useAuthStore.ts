import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserDto, AuthCredentialsDto } from "@/lib/dto";
import { services } from "@/lib/services";
import { apiConfig } from "@/lib/api/config";
import { httpClient } from "@/lib/api/http-client";

interface AuthState {
  user: UserDto | null;
  token: string | null;
  loading: boolean;
  error: string | null;

  login: (creds: AuthCredentialsDto) => Promise<void>;
  logout: () => Promise<void>;
  /** Подтянуть пользователя по сохранённому токену. */
  hydrate: () => Promise<void>;
  updateProfile: (data: { name?: string; phone?: string }) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      login: async (creds) => {
        set({ loading: true, error: null });
        try {
          const session = await services.auth.login(creds);
          set({
            user: session.user,
            token: session.token.accessToken,
            loading: false,
          });
        } catch (e) {
          set({ loading: false, error: (e as { message?: string })?.message ?? "Ошибка" });
        }
      },

      logout: async () => {
        try {
          await services.auth.logout();
        } finally {
          set({ user: null, token: null });
        }
      },

      hydrate: async () => {
        if (!get().token) return;
        const user = await services.auth.me().catch(() => null);
        set({ user });
      },

      updateProfile: async (data) => {
        const user = await services.auth.updateProfile(data);
        set({ user });
      },
    }),
    {
      name: apiConfig.authTokenKey,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ token: s.token }),
    },
  ),
);

// Связываем HttpClient со стором: один источник правды о токене.
httpClient.setAuthTokenProvider(() => useAuthStore.getState().token);
httpClient.setOnUnauthorized(() => {
  useAuthStore.setState({ user: null, token: null });
});
