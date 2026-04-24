import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AccountsModule } from './accounts/accounts.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TransactionsModule } from './transactions/transactions.module';
import { UsersModule } from './users/users.module';
import { MetroModule } from './metro/metro.module';
import { MonoModule } from './mono/mono.module';
import { BudgetModule } from './budget/budget.module';
import { StatisticsModule } from './statistics/statistics.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { DatabaseModule, EventsModule } from '@app/common';

const nodeEnv = process.env.NODE_ENV || 'development';
const legacyEnv = nodeEnv === 'development' ? 'dev' : nodeEnv === 'production' ? 'prod' : nodeEnv;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `.env.${nodeEnv}.local`,
        `.env.${nodeEnv}`,
        `.${legacyEnv}.env`,
        '.env.local',
        '.env',
      ],
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    AccountsModule,
    TransactionsModule,
    MetroModule,
    MonoModule,
    BudgetModule,
    StatisticsModule,
    AnalyticsModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
