/**
 * Контракты доменных сервисов. Каждый сервис описан интерфейсом,
 * под который есть две реализации:
 *
 *  - `*ApiService`  — реальные HTTP-запросы через `HttpClient`
 *  - `*MockService` — отдают данные локально, имитируя сеть (задержка, ошибки)
 *
 * Переключение на бой/мок происходит в `services/index.ts` по флагу
 * `apiConfig.useMocks`. UI-код всегда работает только с интерфейсами и не знает,
 * какая реализация под капотом.
 */

import type {
  ProductDto,
  ProductListQuery,
  CategoryDto,
  Paginated,
  CartDto,
  AddToCartDto,
  UpdateCartItemDto,
  OrderDto,
  CreateOrderDto,
  AiPromptDto,
  AiPromptResponseDto,
  AiMessageDto,
  AuthCredentialsDto,
  AuthSessionDto,
  UserDto,
  ID,
} from "@/lib/dto";

export interface IProductsService {
  list(query?: ProductListQuery): Promise<Paginated<ProductDto>>;
  getById(id: ID): Promise<ProductDto>;
  getBySlug(slug: string): Promise<ProductDto>;
}

export interface ICategoriesService {
  list(): Promise<CategoryDto[]>;
  getById(id: ID): Promise<CategoryDto>;
}

export interface ICartService {
  getCurrent(): Promise<CartDto>;
  addItem(payload: AddToCartDto): Promise<CartDto>;
  updateItem(payload: UpdateCartItemDto): Promise<CartDto>;
  removeItem(itemId: ID): Promise<CartDto>;
  clear(): Promise<CartDto>;
}

export interface IOrdersService {
  list(): Promise<OrderDto[]>;
  getById(id: ID): Promise<OrderDto>;
  create(payload: CreateOrderDto): Promise<OrderDto>;
}

export interface IAiService {
  /** Отправить промпт и получить ответ ассистента + рекомендации. */
  prompt(payload: AiPromptDto): Promise<AiPromptResponseDto>;
  /** История сообщений по conversation id. */
  getConversation(id: ID): Promise<AiMessageDto[]>;
}

export interface IAuthService {
  login(creds: AuthCredentialsDto): Promise<AuthSessionDto>;
  logout(): Promise<void>;
  me(): Promise<UserDto | null>;
}

/** Полный набор сервисов, прокидывается через DI / контейнер. */
export interface ServiceContainer {
  products: IProductsService;
  categories: ICategoriesService;
  cart: ICartService;
  orders: IOrdersService;
  ai: IAiService;
  auth: IAuthService;
}
