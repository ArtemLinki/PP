import { ID, ISODateString } from './common.dto';
import { ProductDto } from './product.dto';
import { CartDto } from './cart.dto';

export type AiRole = 'user' | 'assistant';

export interface AiMessageDto {
  id: ID;
  role: AiRole;
  content: string;
  createdAt: ISODateString;
}

export interface AiChatRequestDto {
  message: string;
  conversationId?: ID;
}

export interface AiToolResultDto {
  recommendedProducts?: ProductDto[];
  addedToCart?: CartDto;
}

export interface AiChatResponseDto {
  conversationId: ID;
  reply: AiMessageDto;
  toolResults?: AiToolResultDto;
}
