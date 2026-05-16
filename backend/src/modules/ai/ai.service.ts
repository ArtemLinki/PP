import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, Content } from '@google/generative-ai';
import { PrismaService } from '../../prisma/prisma.service';
import { AiExecutor } from './ai.executor';
import { aiTools } from './ai.tools';

const SYSTEM_PROMPT = `Ты — ИИ-инженер интернет-магазина TechElectro, специализирующегося на электронных компонентах: микроконтроллерах, сенсорах, модулях питания и робототехнике.

Твои задачи:
- Помогать покупателям подбирать компоненты под их проекты
- Отвечать на вопросы о совместимости, характеристиках и применении
- Использовать инструменты для поиска товаров и добавления в корзину

Правила:
- Отвечай кратко и по делу, на русском языке
- При поиске используй tool searchProducts, не придумывай товары
- Если товар найден — предлагай его конкретно
- Цены отображай в рублях (делить на 100)`;

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly genAI: GoogleGenerativeAI | null = null;

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private executor: AiExecutor,
  ) {
    const apiKey = this.config.get<string>('GEMINI_API_KEY');
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    } else {
      this.logger.warn('GEMINI_API_KEY not set — AI responses will be mocked');
    }
  }

  async chat(message: string, conversationId?: string, userId?: string) {
    // Find or create conversation
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

    // Save user message
    await this.prisma.aiMessage.create({
      data: { conversationId: conversation.id, role: 'user', content: message },
    });

    // If no API key — return stub
    if (!this.genAI) {
      const stub = await this.prisma.aiMessage.create({
        data: {
          conversationId: conversation.id,
          role: 'assistant',
          content: 'GEMINI_API_KEY не настроен. Добавьте ключ в .env для работы ИИ-ассистента.',
        },
      });
      return {
        conversationId: conversation.id,
        reply: { id: stub.id, role: stub.role, content: stub.content, createdAt: stub.createdAt.toISOString() },
        toolResults: undefined,
      };
    }

    // Build Gemini history from saved messages (excluding the just-saved user message)
    const history: Content[] = conversation.messages.map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const model = this.genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: SYSTEM_PROMPT,
      tools: aiTools,
    });

    const chat = model.startChat({ history });

    let replyText = '';
    let toolResults: { recommendedProducts?: any[]; addedToCart?: any } | undefined;

    try {
      const result = await chat.sendMessage(message);
      const response = result.response;

      // Check for function calls
      const fnCalls = response.functionCalls();
      if (fnCalls && fnCalls.length > 0) {
        const toolResponses: Content[] = [];

        for (const fn of fnCalls) {
          const { result: toolResult, toolType } = await this.executor.execute(
            { name: fn.name, args: fn.args as Record<string, any> },
            userId,
          );

          // Accumulate tool results for frontend
          if (toolType === 'searchProducts') {
            toolResults = { ...toolResults, recommendedProducts: toolResult };
          } else if (toolType === 'addToCart') {
            toolResults = { ...toolResults, addedToCart: toolResult };
          }

          toolResponses.push({
            role: 'user',
            parts: [{ functionResponse: { name: fn.name, response: { result: JSON.stringify(toolResult) } } }],
          });
        }

        // Send tool results back to Gemini for final text
        const finalResult = await chat.sendMessage(toolResponses[0].parts);
        replyText = finalResult.response.text();
      } else {
        replyText = response.text();
      }
    } catch (e) {
      this.logger.error('Gemini error:', e);
      replyText = 'Произошла ошибка при обращении к ИИ. Попробуйте позже.';
    }

    // Save assistant reply
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
