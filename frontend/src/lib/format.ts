import type { PriceDto } from "@/lib/dto";

/** Форматирует цену из минорных единиц в человекочитаемый вид. */
export function formatPrice(price: PriceDto | null | undefined): string {
  if (!price) return "—";
  const major = price.amount / 100;
  const formatter = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: price.currency,
    maximumFractionDigits: 0,
  });
  return formatter.format(major);
}
