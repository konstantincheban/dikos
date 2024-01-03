import {
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
  Post,
  Param,
  Body,
  Req,
  Put,
} from '@nestjs/common';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { MongooseClassSerializerInterceptor } from '@app/common';
import { BudgetService, ICreateBudgetData } from './budget.service';
import { Budget } from './schemas/budget.schema';
import { EditBudgetDTO } from './dto/edit-budget-dto';
import { CreateBudgetDTO } from './dto/create-budget-dto';

@Controller('budget')
@UseInterceptors(MongooseClassSerializerInterceptor(Budget))
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async createUserBudget(@Body() data: CreateBudgetDTO, @Req() req) {
    const formattedData: ICreateBudgetData = {
      ...data,
      date: this.budgetService.formatBudgetData(data.date)
    };
    return await this.budgetService.createUserBudget(formattedData, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/edit/:id')
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
