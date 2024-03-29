import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { ForecastBodyDTO, ForecastTypes } from './dto/forecast-dto';
import { Forecast } from './schemas/forecast.schema';
import { MongooseClassSerializerInterceptor } from '@app/common';

@Controller('analytics')
@UseInterceptors(MongooseClassSerializerInterceptor(Forecast))
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('forecast/income')
  async forecastIncome(@Body() body: ForecastBodyDTO, @Req() req) {
    return await this.analyticsService.forecastIncomeOrExpenses(
      req.user.id,
      body.period,
      body.startTime,
      'income',
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('forecast/expenses')
  async forecastExpenses(@Body() body: ForecastBodyDTO, @Req() req) {
    return await this.analyticsService.forecastIncomeOrExpenses(
      req.user.id,
      body.period,
      body.startTime,
      'expenses',
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('forecast/results')
  async getResults(@Req() req) {
    return await this.analyticsService.getResults(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('forecast/transactions/:type/:id')
  async getTransactionsByForecastTimePeriod(
    @Param('type') forecastType: ForecastTypes,
    @Param('id') forecastID: string,
    @Req() req,
  ) {
    return await this.analyticsService.getTransactionsByForecastTimePeriod(
      req.user.id,
      forecastType,
      forecastID,
    );
  }
}
