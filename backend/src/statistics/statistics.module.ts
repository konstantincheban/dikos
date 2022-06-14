import {
  Transaction,
  TransactionSchema,
} from '@transactions/schemas/transactions.schema';
import { BudgetModule } from '@budget/budget.module';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '@auth/auth.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => BudgetModule),
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  providers: [StatisticsService],
  controllers: [StatisticsController],
})
export class StatisticsModule {}
