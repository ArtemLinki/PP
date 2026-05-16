/** Утилиты, общие для всех Mock-сервисов. */
export function delay(ms = 250 + Math.random() * 350): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let idCounter = 1;
export function nextId(prefix = "id"): string {
  return `${prefix}-${Date.now()}-${idCounter++}`;
}
