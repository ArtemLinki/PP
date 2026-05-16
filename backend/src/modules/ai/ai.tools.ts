import { Tool } from '@google/generative-ai';

export const aiTools: Tool[] = [
  {
    functionDeclarations: [
      {
        name: 'searchProducts',
        description: 'Поиск товаров в каталоге TechElectro по запросу и фильтрам',
        parameters: {
          type: 'OBJECT' as any,
          properties: {
            query: { type: 'STRING' as any, description: 'Поисковый запрос' },
            categoryId: { type: 'STRING' as any, description: 'ID категории (опционально)' },
            brandId: { type: 'STRING' as any, description: 'ID бренда (опционально)' },
            maxPrice: { type: 'NUMBER' as any, description: 'Максимальная цена в копейках (опционально)' },
          },
          required: ['query'],
        },
      },
      {
        name: 'getProductDetails',
        description: 'Получить подробную информацию о конкретном товаре по его ID',
        parameters: {
          type: 'OBJECT' as any,
          properties: {
            productId: { type: 'STRING' as any, description: 'ID товара' },
          },
          required: ['productId'],
        },
      },
      {
        name: 'addToCart',
        description: 'Добавить товар в корзину пользователя',
        parameters: {
          type: 'OBJECT' as any,
          properties: {
            productId: { type: 'STRING' as any, description: 'ID товара' },
            quantity: { type: 'NUMBER' as any, description: 'Количество (по умолчанию 1)' },
          },
          required: ['productId'],
        },
      },
    ],
  },
];
