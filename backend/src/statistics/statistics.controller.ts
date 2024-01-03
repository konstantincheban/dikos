import { StatisticsService } from './statistics.service';
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/income_expenses/:date_type/:date_detail?')
  async getIncomeExpensesStatisticsData(
    @Req() req,
    @Param('date_type') dateType: string,
    @Param('date_detail') dateDetail?: string,
  ) {
    if (dateType === 'in_one_year') {
      return await this.statisticsService.getIncomeExpensesStatisticsDataForYear(
        req.user.id,
      );
    } else if (dateType === 'in_one_month' && dateDetail) {
      return await this.statisticsService.getIncomeExpensesStatisticsDataForMonth(
        req.user.id,
        dateDetail,
      );
    }
    throw new BadRequestException(
      'Something went wrong or you are using incorrect parameters. Please try again',
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/budget/:date_type/:date_detail?')
  async getBudgetStatisticsData(
    @Req() req,
    @Param('date_type') dateType: string,
    @Param('date_detail') dateDetail?: string,
  ) {
    if (dateType === 'in_one_year') {
      return await this.statisticsService.getBudgetStatisticsDataForYear(
        req.user.id,
      );
    } else if (dateType === 'in_one_month' && dateDetail) {
      return await this.statisticsService.getBudgetStatisticsDataForMonth(
        req.user.id,
        dateDetail,
      );
    }
    throw new BadRequestException(
      'Something went wrong or you are using incorrect parameters. Please try again',
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/top_categories')
  async getTopCategoriesStatisticsData(@Req() req) {
    return await this.statisticsService.getTopCategoriesStatisticsData(
      req.user.id,
      5,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/top_shops')
  async getTopShopsStatisticsData(@Req() req) {
    return await this.statisticsService.getTopShopsStatisticsData(
      req.user.id,
      5,
    );
  }
}
