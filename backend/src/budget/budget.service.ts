import { EditBudgetDTO } from './dto/edit-budget-dto';
import { BudgetDocument, Budget } from './schemas/budget.schema';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BudgetPerMonthDTO } from './dto/get-budget-dto';
import * as moment from 'moment';

@Injectable()
export class BudgetService {
  constructor(
    @InjectModel(Budget.name)
    private readonly budgetModel: Model<BudgetDocument>,
  ) {}

  get defaultUserBudget() {
    return {
      date: moment().format('YYYY-MM'),
      amount: 0,
      plannedCosts: 0,
      perDay: 0,
    };
  }

  /**
   * Calculate Budget Per Day considering User budget
   * amount @property {number} - amount of budget
   * plannedCosts @property {number} - planned costs for current month
   */
  calculateBudgetPerDay(amount: number, plannedCosts: number) {
    const daysInMonth = moment().daysInMonth();
    return Math.round((amount - plannedCosts) / daysInMonth);
  }

  getBudgetPerMonthByCurrentDate(budgets: BudgetPerMonthDTO[]) {
    const currentDate = moment().format('YYYY-MM');
    return budgets.find((item) => item.date === currentDate);
  }

  // date - '2022-01'
  getBudgetPerDayForMonth(budgets, date: string) {
    return budgets.find((budget) => budget.date === date)?.perDay ?? 0;
  }

  async createUserBudget(data: BudgetPerMonthDTO, userID: string) {
    return await new this.budgetModel({
      userID,
      budgetsPerMonth: [{ ...this.defaultUserBudget, ...data }],
    }).save();
  }

  async editUserBudget(
    data: EditBudgetDTO,
    budgetID: string,
  ): Promise<BudgetPerMonthDTO> {
    try {
      const updateBudgets = await this.budgetModel.findById(budgetID);
      // @ts-ignore
      updateBudgets.budgetsPerMonth = updateBudgets.budgetsPerMonth.map(
        (item) => {
          if (item.date === moment().format('YYYY-MM'))
            return {
              ...item,
              ...data,
              perDay: this.calculateBudgetPerDay(
                data.amount,
                data.plannedCosts,
              ),
            };
          return item;
        },
      );
      const updated = await this.budgetModel.findByIdAndUpdate(
        budgetID,
        {
          ...updateBudgets,
        },
        { new: true },
      );
      const currentBudget = this.getBudgetPerMonthByCurrentDate(
        updated.budgetsPerMonth,
      );
      return {
        amount: currentBudget.amount,
        plannedCosts: currentBudget.plannedCosts,
        perDay: currentBudget.perDay,
      };
    } catch (err) {
      throw new BadRequestException('Something went wrong. Please try again');
    }
  }

  async addBudgetPerMonth(budgetID: string) {
    try {
      const updateBudgets = await this.budgetModel.findById(budgetID);
      updateBudgets.budgetsPerMonth.push(this.defaultUserBudget);
      const updated = await this.budgetModel.findByIdAndUpdate(
        budgetID,
        {
          ...updateBudgets,
        },
        { new: true },
      );
      return this.getBudgetPerMonthByCurrentDate(updated.budgetsPerMonth);
    } catch (err) {
      throw new BadRequestException('Something went wrong. Please try again');
    }
  }

  async getUserBudgetByCurrentMonth(
    budgetID: string,
  ): Promise<BudgetPerMonthDTO> {
    const budgetEntry = await this.budgetModel.findById(budgetID);
    let budgetForCurrentMonth = await this.getBudgetPerMonthByCurrentDate(
      budgetEntry.budgetsPerMonth,
    );
    // generate budgetPerMonth for new month
    if (!budgetForCurrentMonth) {
      budgetForCurrentMonth = await this.addBudgetPerMonth(budgetID);
    }

    return await budgetForCurrentMonth;
  }

  async getUserBudgetForCurrentMonthByUserID(
    userID: string,
  ): Promise<BudgetPerMonthDTO> {
    const budgetEntry = await this.budgetModel.findOne({ userID });
    return this.getBudgetPerMonthByCurrentDate(budgetEntry.budgetsPerMonth);
  }

  async getUserBudgetsByUserID(userID: string): Promise<BudgetPerMonthDTO[]> {
    const budgetEntry = await this.budgetModel.findOne({ userID });
    return budgetEntry.budgetsPerMonth;
  }
}
