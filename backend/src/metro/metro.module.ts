import { forwardRef, Module } from '@nestjs/common';
import { TransactionsModule } from '@transactions/transactions.module';
import { MetroController } from './metro.controller';
import { MetroService } from './metro.service';
import { AccountsModule } from '@accounts/accounts.module';
import { AuthModule } from '@auth/auth.module';
import { EventsModule } from '@app/common';
import { LoggerModule } from '@app/common';

@Module({
  imports: [
    LoggerModule,
    forwardRef(() => AuthModule),
    forwardRef(() => TransactionsModule),
    forwardRef(() => AccountsModule),
    forwardRef(() => EventsModule),
  ],
  providers: [MetroService],
  controllers: [MetroController],
})
export class MetroModule {}
