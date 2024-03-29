import { ROUND_VALUE } from '@utils/constants';
import { Injectable } from '@nestjs/common';
import { BudgetService } from '@budget/budget.service';
import * as moment from 'moment';
import { ForecastResult } from 'src/analytics/schemas/forecast.schema';
import { TransactionsRepository } from '@transactions/transactions.repository';

export interface IBudget {
  name: string;
  budget: number;
  expenses: number;
}

export class ITopCategories {
  name: string;
  count: number;
}

export class IIncomeExpenses {
  name: string;
  income: number;
  expenses: number;
}

export class ITopShop {
  name: string;
  count: number;
}

@Injectable()
export class StatisticsService {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
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

  get expensesSum() {
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

  async getIncomeExpensesStatisticsDataForYear(
    userID: string,
  ): Promise<IIncomeExpenses[]> {
    const data: IIncomeExpenses[] = await this.transactionsRepository.aggregate(
      [
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
            expenses: this.expensesSum,
          },
        },
        {
          $project: {
            _id: 0,
            name: '$_id',
            income: {
              $round: ['$income', ROUND_VALUE],
            },
            expenses: {
              $round: [{ $abs: '$expenses' }, ROUND_VALUE],
            },
          },
        },
      ],
    );

    return this.getInOneYearRequiredEntries()
      .reduce((acc, date) => {
        if (!data.find(({ name }) => name === date)) {
          acc.push({
            name: date,
            income: 0,
            expenses: 0,
          });
        }

        return acc;
      }, data)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async getIncomeExpensesStatisticsDataForMonth(
    userID: string,
    numberOfMonth: string,
  ): Promise<IIncomeExpenses[]> {
    const data: IIncomeExpenses[] = await this.transactionsRepository.aggregate(
      [
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
            expenses: this.expensesSum,
          },
        },
        {
          $project: {
            _id: 0,
            name: '$_id',
            income: {
              $round: ['$income', ROUND_VALUE],
            },
            expenses: {
              $round: [{ $abs: '$expenses' }, ROUND_VALUE],
            },
          },
        },
      ],
    );
    return this.getInOneMonthRequiredEntries(numberOfMonth)
      .reduce((acc, date) => {
        if (!data.find(({ name }) => name === date)) {
          acc.push({
            name: date,
            income: 0,
            expenses: 0,
          });
        }

        return acc;
      }, data)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async getTransactionsDataForSpecificTimePeriod(
    userID: string,
    startTime: string,
    endTime: string,
    type: string,
  ): Promise<ForecastResult[]> {
    const startTimeDate = new Date(startTime);
    const endTimeDate = new Date(endTime);
    return await this.transactionsRepository.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $eq: ['$userID', { $toObjectId: userID }] },
              {
                $gt: ['$date', startTimeDate],
              },
              {
                $lt: ['$date', endTimeDate],
              },
            ],
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          amount: type === 'income' ? this.incomeSum : this.expensesSum,
        },
      },
      {
        $sort: { _id: 1 }, // Sorting in descending order
      },
      {
        $project: {
          _id: 0,
          dateTime: '$_id',
          amount: {
            $round: ['$amount', ROUND_VALUE],
          },
        },
      },
    ]);
  }

  async getBudgetStatisticsDataForYear(userID: string): Promise<IBudget[]> {
    const budgetsByUser = await this.budgetService.getUserBudgetsByUserID(
      userID,
    );
    const data: IBudget[] = await this.transactionsRepository.aggregate([
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
          expenses: this.expensesSum,
        },
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          expenses: {
            $round: [{ $abs: '$expenses' }, ROUND_VALUE],
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
            expenses: 0,
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
  ): Promise<IBudget[]> {
    const budgetsByUser = await this.budgetService.getUserBudgetsByUserID(
      userID,
    );
    const budgetPerDayForSpecificMonth =
      this.budgetService.getBudgetPerDayForMonth(
        budgetsByUser,
        `${moment().format('YYYY')}-${numberOfMonth}`,
      );
    const data: IBudget[] = await this.transactionsRepository.aggregate([
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
          expenses: this.expensesSum,
        },
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          expenses: {
            $round: [{ $abs: '$expenses' }, ROUND_VALUE],
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
            expenses: 0,
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
    top: number,
  ): Promise<ITopCategories[]> {
    return await this.transactionsRepository
      .aggregate<ITopCategories>([
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
      .sort({ count: 'desc' })
      .limit(top);
  }

  async getTopShopsStatisticsData(
    userID: string,
    top: number,
  ): Promise<ITopShop[]> {
    return await this.transactionsRepository
      .aggregate<ITopShop>([
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
      .sort({ count: 'desc' })
      .limit(top);
  }
}
