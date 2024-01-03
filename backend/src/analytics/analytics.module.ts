import { AuthModule } from '@auth/auth.module';
import { Module, forwardRef } from '@nestjs/common';
import { TransactionsModule } from '@transactions/transactions.module';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { Forecast, ForecastSchema } from './schemas/forecast.schema';
import { StatisticsModule } from '@statistics/statistics.module';
import { EventsModule } from '@app/common';
import { DatabaseModule, LoggerModule } from '@app/common';
import { AnalyticsRepository } from './analytics.repository';

@Module({
  imports: [
    LoggerModule,
    forwardRef(() => AuthModule),
    forwardRef(() => TransactionsModule),
    forwardRef(() => StatisticsModule),
    forwardRef(() => EventsModule),
    DatabaseModule.forFeature([
      { name: Forecast.name, schema: ForecastSchema },
    ]),
  ],
  providers: [AnalyticsService, AnalyticsRepository],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}
