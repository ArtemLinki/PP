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

      case 'compareProducts': {
        const ids: string[] = Array.isArray(call.args.productIds)
          ? call.args.productIds.slice(0, 4)
          : [];
        const results = await Promise.allSettled(
          ids.map((id) => this.products.findById(id)),
        );
        const products = results
          .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
          .map((r) => r.value);

        const allKeys = Array.from(
          new Set(products.flatMap((p: any) => (p.specs ?? []).map((s: any) => s.key))),
        );

        const comparison = products.map((p: any) => ({
          id: p.id,
          title: p.name,
          price: p.priceMinor,
          stockStatus: p.stock > 0 ? 'in_stock' : 'out_of_stock',
          specs: Object.fromEntries(
            allKeys.map((k) => {
              const spec = (p.specs ?? []).find((s: any) => s.key === k);
              return [k, spec ? spec.value : '—'];
            }),
          ),
        }));

        return { result: { products: comparison, specKeys: allKeys }, toolType: 'compareProducts' };
      }

      case 'checkStock': {
        const product = await this.products.findById(call.args.productId);
        const stockInfo = {
          id: (product as any).id,
          title: (product as any).name,
          stock: (product as any).stock,
          status: (product as any).stock > 0 ? 'in_stock' : 'out_of_stock',
          price: (product as any).priceMinor,
        };
        return { result: stockInfo, toolType: 'checkStock' };
      }

      case 'getRecommendedByBudget': {
        const budget: number = call.args.budget;
        const data = await this.products.findAll({
          search: call.args.query,
          categoryId: call.args.categoryId,
          priceMax: budget,
          sortBy: 'price',
          sortDir: 'desc',
          pageSize: 6,
        });
        return { result: data.items, toolType: 'getRecommendedByBudget' };
      }

      default:
        return { result: { error: `Unknown tool: ${call.name}` }, toolType: call.name };
    }
  }
}
