"use client";

import { ReactNode, useEffect, useState } from "react";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { techElectroTheme } from "@/theme/mantine-theme";
import { ServicesProvider } from "@/lib/services/ServicesProvider";
import { useAuthStore } from "@/lib/store";

export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
        },
      }),
  );

  // Подтягиваем сессию по сохранённому токену один раз на старте.
  useEffect(() => {
    void useAuthStore.getState().hydrate();
  }, []);

  return (
    <>
      <ColorSchemeScript defaultColorScheme="dark" />
      <MantineProvider theme={techElectroTheme} defaultColorScheme="dark">
        <Notifications position="top-right" />
        <QueryClientProvider client={client}>
          <ServicesProvider>{children}</ServicesProvider>
        </QueryClientProvider>
      </MantineProvider>
    </>
  );
}
