"use client";

import { createContext, useContext, type ReactNode } from "react";
import { services as defaultServices } from "./index";
import type { ServiceContainer } from "./types";

const ServicesContext = createContext<ServiceContainer>(defaultServices);

/** Прокидывает контейнер сервисов в дерево. В тестах можно подменить. */
export function ServicesProvider({
  children,
  services = defaultServices,
}: {
  children: ReactNode;
  services?: ServiceContainer;
}) {
  return <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>;
}

export function useServices(): ServiceContainer {
  return useContext(ServicesContext);
}
