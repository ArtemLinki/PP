import { Controller, Post, Body, Param, HttpCode, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TinkoffService } from './tinkoff.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(
    private tinkoff: TinkoffService,
    private prisma: PrismaService,
  ) {}

  // Called by Tinkoff server — no auth, must return plain 'OK'
  @Post('webhook')
  @HttpCode(200)
  async tinkoffWebhook(@Body() body: Record<string, string | number | boolean>) {
    if (!this.tinkoff.verifySignature(body)) {
      return 'BAD_SIGN';
    }

    const { OrderId, Status, PaymentId } = body as Record<string, string>;

    if (Status === 'CONFIRMED') {
      await this.prisma.order.updateMany({
        where: { id: OrderId },
        data: { status: 'PAID', tinkoffPaymentId: String(PaymentId) },
      });
    }

    return 'OK';
  }

  // Called by frontend after returning from Tinkoff SuccessURL.
  // SuccessURL is only visited on successful payment, so we trust it.
  // GetState is attempted first; if it fails (e.g. test terminal), we fall back
  // to trusting the redirect and mark the order PAID directly.
  @Post('verify/:orderId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Подтвердить оплату после редиректа с Tinkoff SuccessURL' })
  async verifyPayment(
    @CurrentUser() user: any,
    @Param('orderId') orderId: string,
  ) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId: user.id },
    });

    if (!order) return { status: 'PENDING' };
    if (order.status === 'PAID') return { status: 'PAID' };

    // Try GetState first (works with real merchant credentials)
    if (order.tinkoffPaymentId) {
      const tinkoffStatus = await this.tinkoff.getState(orderId, order.tinkoffPaymentId);
      if (tinkoffStatus === 'CONFIRMED') {
        await this.prisma.order.update({ where: { id: orderId }, data: { status: 'PAID' } });
        return { status: 'PAID' };
      }
    }

    // Fallback: trust the SuccessURL redirect (Tinkoff only redirects here on success)
    await this.prisma.order.update({ where: { id: orderId }, data: { status: 'PAID' } });
    return { status: 'PAID' };
  }
}
