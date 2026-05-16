import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private cart: CartService) {}

  @Get()
  getCurrent(@CurrentUser() user: any) {
    return this.cart.getCurrent(user.id);
  }

  @Post('items')
  addItem(@CurrentUser() user: any, @Body() body: { productId: string; quantity?: number }) {
    return this.cart.addItem(user.id, body.productId, body.quantity);
  }

  @Patch('items/:id')
  updateItem(@CurrentUser() user: any, @Param('id') id: string, @Body() body: { quantity: number }) {
    return this.cart.updateItem(user.id, id, body.quantity);
  }

  @Delete('items/:id')
  removeItem(@CurrentUser() user: any, @Param('id') id: string) {
    return this.cart.removeItem(user.id, id);
  }

  @Delete()
  clear(@CurrentUser() user: any) {
    return this.cart.clear(user.id);
  }
}
