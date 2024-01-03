import * as moment from 'moment';
import { EditBudgetDTO } from './dto/edit-budget-dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { BudgetRepository } from './budget.repository';
import { BudgetDocument } from './schemas/budget.schema';

export interface ICreateBudgetData {
  date?: string;
  amount: number;
  plannedCosts: number;
  perDay: number;
}

@Injectable()
export class BudgetService {
  constructor(private readonly budgetRepo: BudgetRepository) {}

  get defaultUserBudget() {
    return {
      date: this.formatBudgetData(new Date()),
      amount: 0,
      plannedCosts: 0,
      perDay: 0,
    };
  }

  formatBudgetData(date: Date): string {
    return moment(date ?? new Date()).format('YYYY-MM');
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

  getBudgetPerMonthByCurrentDate(budgets: BudgetDocument['budgetsPerMonth']) {
    const currentDate = moment().format('YYYY-MM');
    return budgets.find((item) => item.date === currentDate);
  }

  // date - '2022-01'
  getBudgetPerDayForMonth(budgets, date: string) {
    return budgets.find((budget) => budget.date === date)?.perDay ?? 0;
  }

  async createUserBudget(data: ICreateBudgetData, userID: string) {
    return this.budgetRepo.create({
      userID,
      budgetsPerMonth: [{ ...this.defaultUserBudget, ...data }],
    });
  }

  async editUserBudget(data: EditBudgetDTO, budgetID: string) {
    try {
      const updateBudgets = await this.budgetRepo.findOne({ _id: budgetID });
      const updated = await this.budgetRepo.findOneAndUpdate(
        { _id: budgetID },
        {
          ...updateBudgets,
          budgetsPerMonth: updateBudgets.budgetsPerMonth.map((item) => {
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
          }),
        },
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
      const updateBudgets = await this.budgetRepo.findOne({ _id: budgetID });
      updateBudgets.budgetsPerMonth.push(this.defaultUserBudget);
      const updated = await this.budgetRepo.findOneAndUpdate(
        { _id: budgetID },
        {
          ...updateBudgets,
        },
      );
      return this.getBudgetPerMonthByCurrentDate(updated.budgetsPerMonth);
    } catch (err) {
      throw new BadRequestException('Something went wrong. Please try again');
    }
  }

  async getUserBudgetByCurrentMonth(budgetID: string) {
    const budgetEntry = await this.budgetRepo.findOne({ _id: budgetID });
    let budgetForCurrentMonth = await this.getBudgetPerMonthByCurrentDate(
      budgetEntry.budgetsPerMonth,
    );
    // generate budgetPerMonth for new month
    if (!budgetForCurrentMonth) {
      budgetForCurrentMonth = await this.addBudgetPerMonth(budgetID);
    }

    return await budgetForCurrentMonth;
  }

  async getUserBudgetForCurrentMonthByUserID(userID: string) {
    const budgetEntry = await this.budgetRepo.findOne({ userID });
    return this.getBudgetPerMonthByCurrentDate(budgetEntry.budgetsPerMonth);
  }

  async getUserBudgetsByUserID(userID: string) {
    const budgetEntry = await this.budgetRepo.findOne({ userID });
    return budgetEntry.budgetsPerMonth;
  }
}
