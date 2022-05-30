import { BudgetPerMonthDTO } from './dto/get-budget-dto';
import {
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
  Post,
  Param,
  Body,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import MongooseClassSerializerInterceptor from 'src/utils/mongooseClassSerializer.interceptor';
import { BudgetService } from './budget.service';
import { Budget } from './schemas/budget.schema';
import { EditBudgetDTO } from './dto/edit-budget-dto';

@Controller('budget')
@UseInterceptors(MongooseClassSerializerInterceptor(Budget))
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async createUserBudget(@Body() data: BudgetPerMonthDTO, @Req() req) {
    return await this.budgetService.createUserBudget(data, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/edit/:id')
  async editUserBudget(
    @Body() data: EditBudgetDTO,
    @Param('id') budgetID: string,
  ) {
    return await this.budgetService.editUserBudget(data, budgetID);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getUserBudgetByCurrentMonth(@Param('id') budgetID: string) {
    return await this.budgetService.getUserBudgetByCurrentMonth(budgetID);
  }
}
