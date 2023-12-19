import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { ForecastBodyDTO, ForecastTypes } from './dto/forecast-dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('forecast/income')
  async forecastIncome (
    @Body() body: ForecastBodyDTO,
    @Req() req,
  ) {
    return await this.analyticsService.forecastIncome(
      req.user.id,
      body.period,
      body.startTime
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('forecast/expenses')
  async forecastExpenses (
    @Body() body: ForecastBodyDTO,
    @Req() req,
  ) {
    return await this.analyticsService.forecastExpenses(
      req.user.id,
      body.period,
      body.startTime
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('forecast/results')
  async getResults (
    @Req() req,
  ) {
    return await this.analyticsService.getResults(
      req.user.id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('forecast/transactions/:type/:id')
  async getTransactionsByForecastTimePeriod (
    @Param('type') forecastType: ForecastTypes,
    @Param('id') forecastID: string,
    @Req() req,
  ) {
    return await this.analyticsService.getTransactionsByForecastTimePeriod(
      req.user.id,
      forecastType,
      forecastID
    );
  }
}
