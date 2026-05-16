import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { CartService } from '../cart/cart.service';

interface ToolCall {
  name: string;
  args: Record<string, any>;
}

@Injectable()
export class AiExecutor {
  constructor(
    private products: ProductsService,
    private cart: CartService,
  ) {}

  async execute(call: ToolCall, userId?: string): Promise<{ result: any; toolType: string }> {
    switch (call.name) {
      case 'searchProducts': {
        const data = await this.products.findAll({
          search: call.args.query,
          categoryId: call.args.categoryId,
          brandId: call.args.brandId,
          priceMax: call.args.maxPrice,
          pageSize: 6,
        });
        return { result: data.items, toolType: 'searchProducts' };
      }

      case 'getProductDetails': {
        const product = await this.products.findById(call.args.productId);
        return { result: product, toolType: 'getProductDetails' };
      }

      case 'addToCart': {
        if (!userId) return { result: { error: 'Требуется авторизация' }, toolType: 'addToCart' };
        const cart = await this.cart.addItem(userId, call.args.productId, call.args.quantity ?? 1);
        return { result: cart, toolType: 'addToCart' };
      }

      default:
        return { result: { error: `Unknown tool: ${call.name}` }, toolType: call.name };
    }
  }
}
