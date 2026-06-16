import type { IAiService } from "../types";
import type {
  AiPromptDto,
  AiPromptResponseDto,
  AiMessageDto,
  AiRecommendationDto,
  ID,
} from "@/lib/dto";
import { mockProducts } from "@/lib/mocks/products.mock";
import { delay, nextId } from "../_utils";

export class AiMockService implements IAiService {
  private readonly conversations = new Map<ID, AiMessageDto[]>();

  async prompt(payload: AiPromptDto, _signal?: AbortSignal): Promise<AiPromptResponseDto> {
    // Эмулируем «думаю», задержка чуть больше обычной.
    await delay(800 + Math.random() * 1200);

    const conversationId = payload.conversationId ?? nextId("conv");
    const history = this.conversations.get(conversationId) ?? [];

    const userMessage: AiMessageDto = {
      id: nextId("msg"),
      role: "user",
      content: payload.prompt,
      createdAt: new Date().toISOString(),
    };

    const recommendations: AiRecommendationDto[] = mockProducts.slice(0, 3).map((product, i) => ({
      product,
      reason: this.reasonFor(product.title, payload.prompt),
      confidence: 0.92 - i * 0.07,
    }));

    const reply: AiMessageDto = {
      id: nextId("msg"),
      role: "assistant",
      content: this.replyFor(payload.prompt),
      createdAt: new Date().toISOString(),
      recommendations,
    };

    this.conversations.set(conversationId, [...history, userMessage, reply]);

    return { conversationId, reply };
  }

  async getConversation(id: ID): Promise<AiMessageDto[]> {
    await delay();
    return this.conversations.get(id) ?? [];
  }

  private replyFor(prompt: string): string {
    const trimmed = prompt.trim();
    if (!trimmed) return "Опишите проект подробнее — что нужно собрать, и я подберу совместимые компоненты.";
    return `Под задачу «${trimmed}» подобрал стартовый набор. Можно расширить датчиками или сменить контроллер — спросите.`;
  }

  private reasonFor(title: string, _prompt: string): string {
    return `«${title}» хорошо подходит как базовый компонент. Совместим с типовыми библиотеками и драйверами.`;
  }
}
