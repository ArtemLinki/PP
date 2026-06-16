import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { AiExecutor } from './ai.executor';
import { PrismaModule } from '../../prisma/prisma.module';
import { ProductsModule } from '../products/products.module';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [PrismaModule, ProductsModule, CartModule],
  controllers: [AiController],
  providers: [AiService, AiExecutor],
})
export class AiModule {}
