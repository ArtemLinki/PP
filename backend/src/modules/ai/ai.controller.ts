import { Controller, Post, Get, Body, Param, Request } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AiService } from './ai.service';

@ApiTags('ai')
@Controller('ai')
export class AiController {
  constructor(private ai: AiService) {}

  @Post('chat')
  @ApiOperation({ summary: 'Отправить сообщение ИИ-ассистенту' })
  async chat(@Body() body: { message: string; conversationId?: string }, @Request() req: any) {
    const userId = req.user?.id;
    return this.ai.chat(body.message, body.conversationId, userId);
  }

  @Get('conversations/:id')
  @ApiOperation({ summary: 'История диалога по ID' })
  getConversation(@Param('id') id: string) {
    return this.ai.getConversation(id);
  }
}
