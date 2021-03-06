import { ROUND_VALUE } from '@utils/constants';
import { TopShopDTO } from './dto/top-shops-dto';
import { TopCategoriesDTO } from './dto/top-categories-dto';
import { IncomeOutcomeDTO } from './dto/income-outcome-dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  TransactionDocument,
  Transaction,
} from '@transactions/schemas/transactions.schema';
import { BudgetService } from '@budget/budget.service';
import * as moment from 'moment';
import { BudgetDTO } from './dto/budget-dto';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<TransactionDocument>,
    private readonly budgetService: BudgetService,
  ) {}

  getInOneYearRequiredEntries() {
    return Array.from({ length: 12 }).map((item, index) =>
      moment(`${moment().format('YYYY')}-${++index}`, 'YYYY-MM').format(
        'YYYY-MM',
      ),
    );
  }

  getInOneMonthRequiredEntries(numberOfMonth: string) {
    const currentYear = moment().format('YYYY');
    const daysInMonth = moment(`${currentYear}-${numberOfMonth}`).daysInMonth();
    return Array.from({ length: daysInMonth }).map((item, index) =>
      moment(`${currentYear}-${numberOfMonth}-${++index}`, 'YYYY-MM-DD').format(
        'YYYY-MM-DD',
      ),
    );
  }

  get incomeSum() {
    return {
      $sum: {
        $cond: {
          if: { $gt: ['$amount', 0] },
          then: '$amount',
          else: 0,
        },
      },
    };
  }
  get outcomeSum() {
    return {
      $sum: {
        $cond: {
          if: { $lt: ['$amount', 0] },
          then: '$amount',
          else: 0,
        },
      },
    };
  }

  async getIncomeOutcomeStatisticsDataForYear(
    userID: string,
  ): Promise<IncomeOutcomeDTO[]> {
    const data: IncomeOutcomeDTO[] = await this.transactionModel.aggregate([
      {
        $match: {
          $expr: {
            $and: [{ $eq: ['$userID', { $toObjectId: userID }] }],
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
          income: this.incomeSum,
          outcome: this.outcomeSum,
        },
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          income: {
            $round: ['$income', ROUND_VALUE],
          },
          outcome: {
            $round: [{ $abs: '$outcome' }, ROUND_VALUE],
          },
        },
      },
    ]);

    return this.getInOneYearRequiredEntries()
      .reduce((acc, date) => {
        if (!data.find(({ name }) => name === date)) {
          acc.push({
            name: date,
            income: 0,
            outcome: 0,
          });
        }

        return acc;
      }, data)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async getIncomeOutcomeStatisticsDataForMonth(
    userID: string,
    numberOfMonth: string,
  ): Promise<IncomeOutcomeDTO[]> {
    const data: IncomeOutcomeDTO[] = await this.transactionModel.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $eq: ['$userID', { $toObjectId: userID }] },
              {
                $eq: [
                  { $dateToString: { format: '%Y-%m', date: '$date' } },
                  `${moment().format('YYYY')}-${numberOfMonth}`,
                ],
              },
            ],
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          income: this.incomeSum,
          outcome: this.outcomeSum,
        },
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          income: {
            $round: ['$income', ROUND_VALUE],
          },
          outcome: {
            $round: [{ $abs: '$outcome' }, ROUND_VALUE],
          },
        },
      },
    ]);
    return this.getInOneMonthRequiredEntries(numberOfMonth)
      .reduce((acc, date) => {
        if (!data.find(({ name }) => name === date)) {
          acc.push({
            name: date,
            income: 0,
            outcome: 0,
          });
        }

        return acc;
      }, data)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async getBudgetStatisticsDataForYear(userID: string): Promise<BudgetDTO[]> {
    const budgetsByUser = await this.budgetService.getUserBudgetsByUserID(
      userID,
    );
    const data: BudgetDTO[] = await this.transactionModel.aggregate([
      {
        $match: {
          $expr: {
            $and: [{ $eq: ['$userID', { $toObjectId: userID }] }],
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
          outcome: this.outcomeSum,
        },
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          outcome: {
            $round: [{ $abs: '$outcome' }, ROUND_VALUE],
          },
        },
      },
    ]);

    return this.getInOneYearRequiredEntries()
      .reduce((acc, date) => {
        if (!data.find(({ name }) => name === date)) {
          acc.push({
            name: date,
            budget: 0,
            outcome: 0,
          });
        }

        return acc;
      }, data)
      .map((item) => ({
        ...item,
        budget:
          this.budgetService.getBudgetPerDayForMonth(budgetsByUser, item.name) *
          moment(item.name, 'YYYY-MM').daysInMonth(),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async getBudgetStatisticsDataForMonth(
    userID: string,
    numberOfMonth: string,
  ): Promise<BudgetDTO[]> {
    const budgetsByUser = await this.budgetService.getUserBudgetsByUserID(
      userID,
    );
    const budgetPerDayForSpecificMonth =
      this.budgetService.getBudgetPerDayForMonth(
        budgetsByUser,
        `${moment().format('YYYY')}-${numberOfMonth}`,
      );
    const data: BudgetDTO[] = await this.transactionModel.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $eq: ['$userID', { $toObjectId: userID }] },
              {
                $eq: [
                  { $dateToString: { format: '%Y-%m', date: '$date' } },
                  `${moment().format('YYYY')}-${numberOfMonth}`,
                ],
              },
            ],
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          outcome: this.outcomeSum,
        },
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          outcome: {
            $round: [{ $abs: '$outcome' }, ROUND_VALUE],
          },
        },
      },
    ]);
    return this.getInOneMonthRequiredEntries(numberOfMonth)
      .reduce((acc, date) => {
        if (!data.find(({ name }) => name === date)) {
          acc.push({
            name: date,
            budget: 0,
            outcome: 0,
          });
        }

        return acc;
      }, data)
      .map((item) => ({
        ...item,
        budget: budgetPerDayForSpecificMonth,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async getTopCategoriesStatisticsData(
    userID: string,
    top: number
  ): Promise<TopCategoriesDTO[]> {
    return await this.transactionModel.aggregate([
      {
        $match: {
          $expr: {
            $and: [{ $eq: ['$userID', { $toObjectId: userID }] }],
          },
        },
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: {
            $cond: [{ $eq: [{ $strLenCP: '$_id' }, 0] }, 'Unknown', '$_id'],
          },
          count: 1,
        },
      },
    ])
    .sort({ count: 'desc'})
    .limit(top);
  }

  async getTopShopsStatisticsData(userID: string, top: number): Promise<TopShopDTO[]> {
    return await this.transactionModel.aggregate([
      {
        $match: {
          $expr: {
            $and: [{ $eq: ['$userID', { $toObjectId: userID }] }],
          },
        },
      },
      {
        $group: {
          _id: '$paymaster',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: {
            $cond: [{ $eq: [{ $strLenCP: '$_id' }, 0] }, 'Unknown', '$_id'],
          },
          count: 1,
        },
      },
    ])
    .sort({ count: 'desc'})
    .limit(top);
  }
}
