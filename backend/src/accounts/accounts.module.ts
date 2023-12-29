import { BudgetModule } from '@budget/budget.module';
import { Budget, BudgetSchema } from '@budget/schemas/budget.schema';
import {
  Transaction,
  TransactionSchema,
} from '@transactions/schemas/transactions.schema';
import { AccountSchema } from './schemas/accounts.schema';
import { Account } from '@accounts/schemas/accounts.schema';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '@auth/auth.module';
import { DatabaseModule } from '@app/common';
import { TransactionsRepository } from '@transactions/transactions.repository';
import { BudgetRepository } from '@budget/budget.repository';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => BudgetModule),
    DatabaseModule.forFeature([
      { name: Account.name, schema: AccountSchema },
      // { name: Transaction.name, schema: TransactionSchema },
      // { name: Budget.name, schema: BudgetSchema },
    ]),
  ],
  providers: [AccountsService],
  controllers: [AccountsController],
  exports: [AccountsService, TransactionsRepository, BudgetRepository],
})
export class AccountsModule {}
