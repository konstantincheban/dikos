import { StatisticsModule } from '@statistics/statistics.module';
import { forwardRef, Module } from '@nestjs/common';
import { Transaction, TransactionSchema } from './schemas/transactions.schema';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { AuthModule } from '@auth/auth.module';
import { AccountsModule } from '@accounts/accounts.module';
import { DatabaseModule, LoggerModule } from '@app/common';
import { TransactionsRepository } from './transactions.repository';

@Module({
  imports: [
    LoggerModule,
    forwardRef(() => AuthModule),
    forwardRef(() => AccountsModule),
    forwardRef(() => StatisticsModule),
    DatabaseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  providers: [TransactionsService, TransactionsRepository],
  controllers: [TransactionsController],
  exports: [TransactionsService, TransactionsRepository],
})
export class TransactionsModule {}
