import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, UseGuards,
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiBearerAuth, ApiProperty,
  ApiPropertyOptional, ApiQuery,
} from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsEnum, IsBoolean, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole, ProductStatus, OrderStatus } from '@prisma/client';

// ─── Existing DTOs ────────────────────────────────────────────────────────────

class UpdateProductStatusDto {
  @ApiProperty({ enum: ProductStatus, description: 'New product status' })
  status: ProductStatus;
}

class UpdateOrderStatusDto {
  @ApiProperty({ enum: OrderStatus, description: 'New order status' })
  status: OrderStatus;
}

// ─── Product DTOs ─────────────────────────────────────────────────────────────

export class CreateProductDto {
  @ApiProperty({ description: 'Product name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'URL-friendly slug' })
  @IsString()
  slug: string;

  @ApiProperty({ description: 'Stock-keeping unit' })
  @IsString()
  sku: string;

  @ApiPropertyOptional({ description: 'Short description' })
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @ApiPropertyOptional({ description: 'Full description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Price in kopecks' })
  @IsNumber()
  priceMinor: number;

  @ApiPropertyOptional({ description: 'Old price in kopecks (for sale display)' })
  @IsOptional()
  @IsNumber()
  oldPriceMinor?: number;

  @ApiPropertyOptional({ description: 'Stock quantity', default: 0 })
  @IsOptional()
  @IsNumber()
  stock?: number;

  @ApiPropertyOptional({ enum: ProductStatus, description: 'Product status', default: ProductStatus.DRAFT })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiPropertyOptional({ description: 'Category ID' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ description: 'Brand ID' })
  @IsOptional()
  @IsString()
  brandId?: string;

  @ApiPropertyOptional({ description: 'Image URLs', type: [String] })
  @IsOptional()
  @IsArray()
  images?: string[];

  @ApiPropertyOptional({ description: 'Product specs (JSON)' })
  @IsOptional()
  specs?: any;

  @ApiPropertyOptional({ description: 'Tags', type: [String] })
  @IsOptional()
  @IsArray()
  tags?: string[];
}

export class UpdateProductDto {
  @ApiPropertyOptional({ description: 'Product name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'URL-friendly slug' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ description: 'Stock-keeping unit' })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiPropertyOptional({ description: 'Short description' })
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @ApiPropertyOptional({ description: 'Full description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Price in kopecks' })
  @IsOptional()
  @IsNumber()
  priceMinor?: number;

  @ApiPropertyOptional({ description: 'Old price in kopecks' })
  @IsOptional()
  @IsNumber()
  oldPriceMinor?: number;

  @ApiPropertyOptional({ description: 'Stock quantity' })
  @IsOptional()
  @IsNumber()
  stock?: number;

  @ApiPropertyOptional({ enum: ProductStatus, description: 'Product status' })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiPropertyOptional({ description: 'Category ID' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ description: 'Brand ID' })
  @IsOptional()
  @IsString()
  brandId?: string;

  @ApiPropertyOptional({ description: 'Image URLs', type: [String] })
  @IsOptional()
  @IsArray()
  images?: string[];

  @ApiPropertyOptional({ description: 'Product specs (JSON)' })
  @IsOptional()
  specs?: any;

  @ApiPropertyOptional({ description: 'Tags', type: [String] })
  @IsOptional()
  @IsArray()
  tags?: string[];
}

// ─── Category DTOs ────────────────────────────────────────────────────────────

export class CreateCategoryDto {
  @ApiProperty({ description: 'Category name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'URL-friendly slug' })
  @IsString()
  slug: string;

  @ApiPropertyOptional({ description: 'Parent category ID' })
  @IsOptional()
  @IsString()
  parentId?: string;

  @ApiPropertyOptional({ description: 'Visible on storefront', default: true })
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @ApiPropertyOptional({ description: 'Sort order', default: 0 })
  @IsOptional()
  @IsNumber()
  order?: number;
}

export class UpdateCategoryDto {
  @ApiPropertyOptional({ description: 'Category name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'URL-friendly slug' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ description: 'Parent category ID' })
  @IsOptional()
  @IsString()
  parentId?: string;

  @ApiPropertyOptional({ description: 'Visible on storefront' })
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @ApiPropertyOptional({ description: 'Sort order' })
  @IsOptional()
  @IsNumber()
  order?: number;
}

// ─── Brand DTOs ───────────────────────────────────────────────────────────────

export class CreateBrandDto {
  @ApiProperty({ description: 'Brand name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'URL-friendly slug' })
  @IsString()
  slug: string;

  @ApiPropertyOptional({ description: 'Country of origin' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ description: 'Brand website URL' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({ description: 'Logo image URL' })
  @IsOptional()
  @IsString()
  logoUrl?: string;
}

export class UpdateBrandDto {
  @ApiPropertyOptional({ description: 'Brand name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'URL-friendly slug' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ description: 'Country of origin' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ description: 'Brand website URL' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({ description: 'Logo image URL' })
  @IsOptional()
  @IsString()
  logoUrl?: string;
}

// ─── Controller ───────────────────────────────────────────────────────────────

@ApiTags('admin')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Admin dashboard stats' })
  getDashboard() {
    return this.adminService.getDashboard();
  }

  @Patch('products/:id/status')
  @ApiOperation({ summary: 'Update product status' })
  updateProductStatus(
    @Param('id') id: string,
    @Body() dto: UpdateProductStatusDto,
  ) {
    return this.adminService.updateProductStatus(id, dto.status);
  }

  @Patch('orders/:id/status')
  @ApiOperation({ summary: 'Update order status' })
  updateOrderStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.adminService.updateOrderStatus(id, dto.status);
  }

  // ─── Products CRUD ──────────────────────────────────────────────────────────

  @Get('products')
  @ApiOperation({ summary: 'List all products (admin, paginated, filterable)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: ProductStatus })
  listProducts(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.listProducts(
      page ? parseInt(page, 10) : 1,
      pageSize ? parseInt(pageSize, 10) : 20,
      search || undefined,
      status as ProductStatus | undefined,
    );
  }

  @Post('products')
  @ApiOperation({ summary: 'Create a new product' })
  createProduct(@Body() dto: CreateProductDto) {
    return this.adminService.createProduct(dto);
  }

  @Patch('products/:id')
  @ApiOperation({ summary: 'Update product fields' })
  updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.adminService.updateProduct(id, dto);
  }

  @Delete('products/:id')
  @ApiOperation({ summary: 'Delete a product' })
  deleteProduct(@Param('id') id: string) {
    return this.adminService.deleteProduct(id);
  }

  // ─── Categories CRUD ────────────────────────────────────────────────────────

  @Get('categories')
  @ApiOperation({ summary: 'List all categories (admin)' })
  listCategories() {
    return this.adminService.listCategories();
  }

  @Post('categories')
  @ApiOperation({ summary: 'Create a new category' })
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.adminService.createCategory(dto);
  }

  @Patch('categories/:id')
  @ApiOperation({ summary: 'Update category' })
  updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.adminService.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  @ApiOperation({ summary: 'Delete a category' })
  deleteCategory(@Param('id') id: string) {
    return this.adminService.deleteCategory(id);
  }

  // ─── Brands CRUD ────────────────────────────────────────────────────────────

  @Get('brands')
  @ApiOperation({ summary: 'List all brands (admin)' })
  listBrands() {
    return this.adminService.listBrands();
  }

  @Post('brands')
  @ApiOperation({ summary: 'Create a new brand' })
  createBrand(@Body() dto: CreateBrandDto) {
    return this.adminService.createBrand(dto);
  }

  @Patch('brands/:id')
  @ApiOperation({ summary: 'Update brand' })
  updateBrand(@Param('id') id: string, @Body() dto: UpdateBrandDto) {
    return this.adminService.updateBrand(id, dto);
  }

  @Delete('brands/:id')
  @ApiOperation({ summary: 'Delete a brand' })
  deleteBrand(@Param('id') id: string) {
    return this.adminService.deleteBrand(id);
  }

  // ─── Orders ─────────────────────────────────────────────────────────────────

  @Get('orders')
  @ApiOperation({ summary: 'List all orders (admin, paginated, filterable)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: OrderStatus })
  listOrders(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('userId') userId?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.listOrders(
      page ? parseInt(page, 10) : 1,
      pageSize ? parseInt(pageSize, 10) : 50,
      userId,
      status as OrderStatus | undefined,
    );
  }

  // ─── Users ──────────────────────────────────────────────────────────────────

  @Get('users')
  @ApiOperation({ summary: 'List all users (admin, paginated)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  listUsers(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.adminService.listUsers(
      page ? parseInt(page, 10) : 1,
      pageSize ? parseInt(pageSize, 10) : 20,
    );
  }
}
