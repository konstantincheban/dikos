import { forwardRef, Module } from '@nestjs/common';
import { TransactionsModule } from '@transactions/transactions.module';
import { MonoController } from './mono.controller';
import { MonoService } from './mono.service';
import { AccountsModule } from '@accounts/accounts.module';
import { AuthModule } from '@auth/auth.module';
import { EventsModule } from '@events/events.module';
import { LoggerModule } from '@app/common';

@Module({
  imports: [
    LoggerModule,
    forwardRef(() => AuthModule),
    forwardRef(() => TransactionsModule),
    forwardRef(() => AccountsModule),
    forwardRef(() => EventsModule)
  ],
  providers: [MonoService],
  controllers: [MonoController],
})
export class MonoModule {}
