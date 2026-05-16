import { Controller, Get, Param } from '@nestjs/common';
import { BrandsService } from './brands.service';

@Controller('brands')
export class BrandsController {
  constructor(private brands: BrandsService) {}

  @Get()
  findAll() { return this.brands.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.brands.findById(id); }
}
