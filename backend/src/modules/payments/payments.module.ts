import { Module } from '@nestjs/common';
import { TinkoffService } from './tinkoff.service';
import { PaymentsController } from './payments.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PaymentsController],
  providers: [TinkoffService],
  exports: [TinkoffService],
})
export class PaymentsModule {}
