import {
  Transaction,
  TransactionSchema,
} from '@transactions/schemas/transactions.schema';
import { BudgetModule } from '@budget/budget.module';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '@auth/auth.module';
import { DatabaseModule } from '@app/common';
import { TransactionsRepository } from '@transactions/transactions.repository';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => BudgetModule),
    DatabaseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  providers: [StatisticsService],
  controllers: [StatisticsController],
  exports: [StatisticsService, TransactionsRepository]
})
export class StatisticsModule {}
