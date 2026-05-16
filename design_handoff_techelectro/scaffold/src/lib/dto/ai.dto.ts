import type { ID, ISODateString } from "./common.dto";
import type { ProductDto } from "./product.dto";

/** Сообщение в диалоге с ИИ-инженером. */
export interface AiMessageDto {
  id: ID;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: ISODateString;
  /** Подборка товаров, если ассистент их предложил. */
  recommendations?: AiRecommendationDto[];
}

export interface AiRecommendationDto {
  product: ProductDto;
  reason: string;
  /** 0..1, насколько уверенно ИИ рекомендует. */
  confidence: number;
}

/** Запрос подбора компонентов из главного экрана. */
export interface AiPromptDto {
  prompt: string;
  /** Опционально: история диалога, если идёт продолжение. */
  conversationId?: ID;
}

export interface AiPromptResponseDto {
  conversationId: ID;
  reply: AiMessageDto;
}
