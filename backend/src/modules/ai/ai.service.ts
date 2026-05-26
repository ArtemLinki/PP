import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';
import type { ChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions';
import { PrismaService } from '../../prisma/prisma.service';
import { AiExecutor } from './ai.executor';
import { aiTools } from './ai.tools';

const MODEL = 'qwen/qwen3-32b';

function stripThinking(text: string): string {
  return text.replace(/<think>[\s\S]*?<\/think>\s*/g, '').trim();
}

const SYSTEM_PROMPT = `Ты — ИИ-инженер интернет-магазина TechElectro, специализирующегося на электронных компонентах: микроконтроллерах, сенсорах, модулях питания и робототехнике.

Твои задачи:
- Помогать покупателям подбирать компоненты под их проекты
- Отвечать на вопросы о совместимости, характеристиках и применении электроники
- Использовать инструменты для поиска товаров и добавления в корзину

Правила:
- Отвечай кратко и по делу, на русском языке
- При поиске используй tool searchProducts, не придумывай товары
- Если товар найден — предлагай его конкретно
- Цены отображай в рублях (делить на 100)
- СТРОГО: отвечай ТОЛЬКО на вопросы, связанные с электроникой, электронными компонентами, робототехникой, IoT, схемотехникой и подбором товаров магазина. Если пользователь задаёт вопрос на другую тему (политика, кулинария, история, развлечения и т.д.) — вежливо откажи и предложи задать вопрос по теме электроники.`;

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly groq: Groq | null = null;

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private executor: AiExecutor,
  ) {
    const apiKey = this.config.get<string>('AI_API_KEY');
    if (apiKey) {
      this.groq = new Groq({ apiKey });
    } else {
      this.logger.warn('AI_API_KEY not set — AI responses will be mocked');
    }
  }

  async chat(message: string, conversationId?: string, userId?: string) {
    let conversation = conversationId
      ? await this.prisma.aiConversation.findUnique({
          where: { id: conversationId },
          include: { messages: { orderBy: { createdAt: 'asc' } } },
        })
      : null;

    if (!conversation) {
      conversation = await this.prisma.aiConversation.create({
        data: { userId: userId ?? null },
        include: { messages: { orderBy: { createdAt: 'asc' } } },
      });
    }

    await this.prisma.aiMessage.create({
      data: { conversationId: conversation.id, role: 'user', content: message },
    });

    if (!this.groq) {
      const stub = await this.prisma.aiMessage.create({
        data: {
          conversationId: conversation.id,
          role: 'assistant',
          content: 'AI_API_KEY не настроен. Добавьте ключ Groq в .env для работы ИИ-ассистента.',
        },
      });
      return {
        conversationId: conversation.id,
        reply: { id: stub.id, role: stub.role, content: stub.content, createdAt: stub.createdAt.toISOString() },
        toolResults: undefined,
      };
    }

    // Build message history in OpenAI format
    const history: ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversation.messages.map((m): ChatCompletionMessageParam => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      })),
      { role: 'user', content: message },
    ];

    let replyText = '';
    let toolResults: { recommendedProducts?: any[]; addedToCart?: any; comparison?: any } | undefined;

    try {
      // Multi-turn tool calling loop
      const MAX_ROUNDS = 5;
      for (let round = 0; round < MAX_ROUNDS; round++) {
        const response = await this.groq.chat.completions.create({
          model: MODEL,
          messages: history,
          tools: aiTools,
          tool_choice: 'auto',
          // @ts-ignore — groq-sdk may not have this typed yet
          reasoning_effort: 'none',
        } as any);

        const choice = response.choices[0];
        history.push(choice.message as ChatCompletionMessageParam);

        if (choice.finish_reason !== 'tool_calls' || !choice.message.tool_calls?.length) {
          replyText = stripThinking(choice.message.content ?? '');
          break;
        }

        for (const tc of choice.message.tool_calls) {
          const args = JSON.parse(tc.function.arguments) as Record<string, any>;
          const { result: toolResult, toolType } = await this.executor.execute(
            { name: tc.function.name, args },
            userId,
          );

          if (toolType === 'searchProducts') {
            toolResults = { ...toolResults, recommendedProducts: toolResult };
          } else if (toolType === 'getRecommendedByBudget') {
            toolResults = { ...toolResults, recommendedProducts: toolResult };
          } else if (toolType === 'addToCart') {
            toolResults = { ...toolResults, addedToCart: toolResult };
          } else if (toolType === 'compareProducts') {
            toolResults = { ...toolResults, comparison: toolResult };
          }

          history.push({
            role: 'tool',
            tool_call_id: tc.id,
            content: JSON.stringify(toolResult),
          });
        }
      }
    } catch (e: any) {
      this.logger.error('Groq error:', e);
      if (e?.status === 429 || e?.message?.includes('429') || e?.message?.includes('quota')) {
        replyText = 'Превышен лимит запросов к ИИ. Подождите минуту и попробуйте снова.';
      } else {
        replyText = 'Произошла ошибка при обращении к ИИ. Попробуйте позже.';
      }
    }

    const savedReply = await this.prisma.aiMessage.create({
      data: { conversationId: conversation.id, role: 'assistant', content: replyText },
    });

    return {
      conversationId: conversation.id,
      reply: {
        id: savedReply.id,
        role: savedReply.role,
        content: savedReply.content,
        createdAt: savedReply.createdAt.toISOString(),
      },
      toolResults,
    };
  }

  async getConversation(id: string) {
    const messages = await this.prisma.aiMessage.findMany({
      where: { conversationId: id },
      orderBy: { createdAt: 'asc' },
    });
    return messages.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      createdAt: m.createdAt.toISOString(),
    }));
  }
}
