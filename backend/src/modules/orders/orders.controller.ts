import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('orders')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private orders: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Список заказов текущего пользователя' })
  findAll(@CurrentUser() user: any) {
    return this.orders.findAll(user.id);
  }

  @Get('last-delivery')
  @ApiOperation({ summary: 'Данные доставки из последнего заказа для предзаполнения формы' })
  getLastDelivery(@CurrentUser() user: any) {
    return this.orders.getLastDelivery(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Заказ по ID' })
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.orders.findById(user.id, id);
  }

  @Post()
  @ApiOperation({ summary: 'Создать заказ из корзины' })
  create(
    @CurrentUser() user: any,
    @Body()
    body: {
      items: { productId: string; quantity: number }[];
      delivery?: {
        deliveryName?: string;
        deliveryPhone?: string;
        deliveryCity?: string;
        deliveryAddress?: string;
      };
    },
  ) {
    return this.orders.create(user.id, body.items, body.delivery);
  }
}
