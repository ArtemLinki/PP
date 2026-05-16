import { Controller, Get, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private cats: CategoriesService) {}

  @Get()
  findAll() { return this.cats.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.cats.findById(id); }
}
