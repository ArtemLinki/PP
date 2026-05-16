import type { ID, ISODateString } from './common.dto';
import type { ProductDto } from './product.dto';
import type { CartDto } from './cart.dto';

export interface AiRecommendationDto {
  product: ProductDto;
  reason: string;
  confidence: number;
}

export interface AiMessageDto {
  id: ID;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: ISODateString;
  recommendations?: AiRecommendationDto[];
}

export interface AiPromptDto {
  prompt: string;
  conversationId?: ID;
}

export interface AiPromptResponseDto {
  conversationId: ID;
  reply: AiMessageDto;
}

export interface AiToolResultDto {
  recommendedProducts?: ProductDto[];
  addedToCart?: CartDto;
}

export interface AiChatRequestDto {
  message: string;
  conversationId?: ID;
}

export interface AiChatResponseDto {
  conversationId: ID;
  reply: AiMessageDto;
  toolResults?: AiToolResultDto;
}
