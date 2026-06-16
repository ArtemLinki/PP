import type { CategoryDto } from "@/lib/dto";

export const mockCategories: CategoryDto[] = [
  { id: "cat-mcu", slug: "microcontrollers", title: "Микроконтроллеры", iconKey: "cpu", productCount: 24 },
  { id: "cat-sbc", slug: "sbc", title: "Одноплатные ПК", iconKey: "server", productCount: 12 },
  { id: "cat-sensors", slug: "sensors", title: "Сенсоры", iconKey: "wave", productCount: 58 },
  { id: "cat-power", slug: "power", title: "Питание и АКБ", iconKey: "battery", productCount: 33 },
  { id: "cat-motors", slug: "motors", title: "Моторы и приводы", iconKey: "rotate", productCount: 19 },
  { id: "cat-robotics", slug: "robotics", title: "Роботика", iconKey: "robot", productCount: 27 },
];
