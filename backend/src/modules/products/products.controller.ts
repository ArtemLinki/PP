import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private products: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Список товаров с поиском, фильтрами и пагинацией' })
  @ApiQuery({ name: 'search', required: false, description: 'Текстовый поиск' })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'brandId', required: false })
  @ApiQuery({ name: 'priceMin', required: false, type: Number, description: 'Мин. цена в копейках' })
  @ApiQuery({ name: 'priceMax', required: false, type: Number, description: 'Макс. цена в копейках' })
  @ApiQuery({ name: 'inStockOnly', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 24 })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['price', 'name', 'createdAt'] })
  @ApiQuery({ name: 'sortDir', required: false, enum: ['asc', 'desc'] })
  findAll(
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
    @Query('brandId') brandId?: string,
    @Query('priceMin') priceMin?: string,
    @Query('priceMax') priceMax?: string,
    @Query('inStockOnly') inStockOnly?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortDir') sortDir?: string,
  ) {
    return this.products.findAll({
      search,
      categoryId,
      brandId,
      priceMin: priceMin ? Number(priceMin) : undefined,
      priceMax: priceMax ? Number(priceMax) : undefined,
      inStockOnly: inStockOnly === 'true',
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 24,
      sortBy,
      sortDir: sortDir as 'asc' | 'desc' | undefined,
    });
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Товар по slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.products.findBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Товар по ID' })
  findOne(@Param('id') id: string) {
    return this.products.findById(id);
  }
}
