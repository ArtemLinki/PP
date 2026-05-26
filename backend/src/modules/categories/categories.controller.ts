import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private cats: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Дерево видимых категорий (L1 + дочерние L2)' })
  findAll() { return this.cats.findAll(); }

  @Get(':id')
  @ApiOperation({ summary: 'Категория по ID' })
  findOne(@Param('id') id: string) { return this.cats.findById(id); }
}
