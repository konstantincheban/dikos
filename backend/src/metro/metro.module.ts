import { forwardRef, Module } from '@nestjs/common';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { MetroController } from './metro.controller';
import { MetroService } from './metro.service';
import { AccountsModule } from 'src/accounts/accounts.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => TransactionsModule),
    forwardRef(() => AccountsModule),
  ],
  providers: [MetroService],
  controllers: [MetroController],
})
export class MetroModule {}
