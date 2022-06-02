import { forwardRef, Module } from '@nestjs/common';
import { TransactionsModule } from '@transactions/transactions.module';
import { MetroController } from './metro.controller';
import { MetroService } from './metro.service';
import { AccountsModule } from '@accounts/accounts.module';
import { AuthModule } from '@auth/auth.module';

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
