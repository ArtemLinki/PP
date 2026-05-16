import type { ChatCompletionTool } from 'groq-sdk/resources/chat/completions';

export const aiTools: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'searchProducts',
      description: 'Поиск товаров в каталоге TechElectro по запросу и фильтрам',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Поисковый запрос' },
          categoryId: { type: 'string', description: 'ID категории (опционально)' },
          brandId: { type: 'string', description: 'ID бренда (опционально)' },
          maxPrice: { type: 'number', description: 'Максимальная цена в копейках (опционально)' },
        },
        required: ['query'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getProductDetails',
      description: 'Получить подробную информацию о конкретном товаре по его ID',
      parameters: {
        type: 'object',
        properties: {
          productId: { type: 'string', description: 'ID товара' },
        },
        required: ['productId'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'addToCart',
      description: 'Добавить товар в корзину пользователя',
      parameters: {
        type: 'object',
        properties: {
          productId: { type: 'string', description: 'ID товара' },
          quantity: { type: 'number', description: 'Количество (по умолчанию 1)' },
        },
        required: ['productId'],
      },
    },
  },
];
