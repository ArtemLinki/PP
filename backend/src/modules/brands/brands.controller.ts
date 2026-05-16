import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BrandsService } from './brands.service';

@ApiTags('brands')
@Controller('brands')
export class BrandsController {
  constructor(private brands: BrandsService) {}

  @Get()
  @ApiOperation({ summary: 'Список всех брендов' })
  findAll() { return this.brands.findAll(); }

  @Get(':id')
  @ApiOperation({ summary: 'Бренд по ID' })
  findOne(@Param('id') id: string) { return this.brands.findById(id); }
}
