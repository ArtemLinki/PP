import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('cart')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private cart: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Текущая корзина пользователя (создаётся автоматически)' })
  getCurrent(@CurrentUser() user: any) {
    return this.cart.getCurrent(user.id);
  }

  @Post('items')
  @ApiOperation({ summary: 'Добавить товар в корзину' })
  addItem(@CurrentUser() user: any, @Body() body: { productId: string; quantity?: number }) {
    return this.cart.addItem(user.id, body.productId, body.quantity);
  }

  @Patch('items/:id')
  @ApiOperation({ summary: 'Изменить количество позиции' })
  updateItem(@CurrentUser() user: any, @Param('id') id: string, @Body() body: { quantity: number }) {
    return this.cart.updateItem(user.id, id, body.quantity);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Удалить позицию из корзины' })
  removeItem(@CurrentUser() user: any, @Param('id') id: string) {
    return this.cart.removeItem(user.id, id);
  }

  @Delete()
  @ApiOperation({ summary: 'Очистить корзину' })
  clear(@CurrentUser() user: any) {
    return this.cart.clear(user.id);
  }
}
