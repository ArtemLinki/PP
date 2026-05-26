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
  {
    type: 'function',
    function: {
      name: 'compareProducts',
      description: 'Сравнить несколько товаров по характеристикам и цене. Возвращает таблицу сравнения характеристик (specs) и цены для каждого товара.',
      parameters: {
        type: 'object',
        properties: {
          productIds: {
            type: 'array',
            items: { type: 'string' },
            description: 'Список ID товаров для сравнения (2–4 штуки)',
          },
        },
        required: ['productIds'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'checkStock',
      description: 'Проверить наличие и количество товара на складе по его ID',
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
      name: 'getRecommendedByBudget',
      description: 'Подобрать товары под заданный бюджет. Возвращает список товаров, которые покупатель может приобрести в рамках указанной суммы.',
      parameters: {
        type: 'object',
        properties: {
          budget: {
            type: 'number',
            description: 'Максимальный бюджет в копейках (например, 50000 = 500 рублей)',
          },
          query: {
            type: 'string',
            description: 'Тип товара или задача (опционально, уточняет поиск)',
          },
          categoryId: {
            type: 'string',
            description: 'ID категории (опционально)',
          },
        },
        required: ['budget'],
      },
    },
  },
];
