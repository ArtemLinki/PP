import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { OptionalJwtAuthGuard } from '../../common/guards/optional-jwt-auth.guard';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private reviews: ReviewsService) {}

  @Get('product/:productId')
  @ApiOperation({ summary: 'Список отзывов на товар' })
  @UseGuards(OptionalJwtAuthGuard)
  findByProduct(@Param('productId') productId: string) {
    return this.reviews.findByProduct(productId);
  }

  @Post()
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Оставить отзыв' })
  create(
    @CurrentUser() user: any,
    @Body() body: { productId: string; rating: number; comment?: string },
  ) {
    return this.reviews.create(user.id, body.productId, body.rating, body.comment);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Удалить свой отзыв' })
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.reviews.remove(user.id, id);
  }
}
