import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private orders: OrdersService) {}

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.orders.findAll(user.id);
  }

  @Get(':id')
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.orders.findById(user.id, id);
  }

  @Post()
  create(@CurrentUser() user: any, @Body() body: { items: { productId: string; quantity: number }[] }) {
    return this.orders.create(user.id, body.items);
  }
}
