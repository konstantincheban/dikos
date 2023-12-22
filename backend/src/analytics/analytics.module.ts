import { AuthModule } from '@auth/auth.module';
import { Module, forwardRef } from '@nestjs/common';
import { TransactionsModule } from '@transactions/transactions.module';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Forecast, ForecastSchema } from './schemas/forecast.schema';
import { StatisticsModule } from '@statistics/statistics.module';
import { EventsModule } from '@events/events.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => TransactionsModule),
    forwardRef(() => StatisticsModule),
    forwardRef(() => EventsModule),
    MongooseModule.forFeature([
      { name: Forecast.name, schema: ForecastSchema },
    ]),
  ],
  providers: [AnalyticsService],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}
