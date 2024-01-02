import * as moment from 'moment';
import { BudgetService } from '@budget/budget.service';
import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateAccountDTO } from './dto/create-account.dto';
import { EditAccountDTO } from './dto/edit-account.dto';
import { ROUND_VALUE } from '@utils/constants';
import { AccountsRepository } from './accounts.repository';
import { TransactionsRepository } from '@transactions/transactions.repository';

interface IAccountSummary {
  income: number;
  expenses: number;
  byDay: number;
  byWeek: number;
  byMonth: number;
}

@Injectable()
export class AccountsService {
  constructor(
    private readonly accountsRepo: AccountsRepository,
    private readonly transactionsRepo: TransactionsRepository,
    private readonly budgetService: BudgetService,
  ) {}

  get defaultAccountData(): Omit<CreateAccountDTO, 'userID'> {
    return {
      name: 'Default',
      description: 'Default Account',
      currency: 'UAH',
      type: 'default',
    };
  }

  calcPercentage(number, fromNumber) {
    const percentage = Math.round((number * 100) / fromNumber);
    return isNaN(percentage) || !isFinite(percentage) ? 0 : percentage;
  }

  async createAccount(data: CreateAccountDTO & { userID: string }) {
    return this.accountsRepo.create(data);
  }

  async editAccount(
    accountID: string,
    data: EditAccountDTO,
  ) {
    try {
      const updatedAccount = await this.accountsRepo.findOneAndUpdate(
        { _id: accountID},
        { $set: data }
      );
      return updatedAccount;
    } catch (err) {
      throw new BadRequestException('Something went wrong. Please try again');
    }
  }

  async deleteAccount(accountID: string) {
    try {
      await this.accountsRepo.findOneAndDelete({ _id: accountID });
      await this.transactionsRepo.deleteMany({ accountID: accountID });
      return {
        message: 'Account and related transactions were removed successfully',
      };
    } catch (err) {
      throw new BadRequestException('Something went wrong. Please try again');
    }
  }

  get amountSumAggregationStages() {
    return [
      {
        $group: {
          _id: '',
          amounts: { $push: '$amount' },
        },
      },
      {
        $project: {
          value: {
            $round: [
              {
                $reduce: {
                  input: '$amounts',
                  initialValue: 0,
                  in: { $add: ['$$value', '$$this'] },
                },
              },
              ROUND_VALUE,
            ],
          },
        },
      },
    ];
  }

  async getAccountSummary(
    accountID: string,
    userID: string,
  ) {
    const data = await this.transactionsRepo.aggregate<IAccountSummary>([
      {
        $match: {
          $expr: {
            $and: [{ $eq: ['$accountID', { $toObjectId: accountID }] }],
          },
        },
      },
      {
        $group: {
          _id: '$accountID',
          income: {
            $sum: {
              $cond: {
                if: { $gt: ['$amount', 0] },
                then: '$amount',
                else: 0,
              },
            },
          },
          expenses: {
            $sum: {
              $cond: {
                if: { $lt: ['$amount', 0] },
                then: '$amount',
                else: 0,
              },
            },
          },
          byDay: {
            $sum: {
              $cond: {
                if: {
                  $and: [
                    {
                      $eq: [
                        {
                          $dateToString: { format: '%Y-%m-%d', date: '$date' },
                        },
                        moment().format('YYYY-MM-DD'),
                      ],
                    },
                    { $lt: ['$amount', 0] },
                  ],
                },
                then: '$amount',
                else: 0,
              },
            },
          },
          byWeek: {
            $sum: {
              $cond: {
                if: {
                  $and: [
                    {
                      $eq: [{ $isoWeek: '$date' }, moment().isoWeek()],
                    },
                    { $lt: ['$amount', 0] },
                  ],
                },
                then: '$amount',
                else: 0,
              },
            },
          },
          byMonth: {
            $sum: {
              $cond: {
                if: {
                  $and: [
                    {
                      $eq: [
                        { $dateToString: { format: '%Y-%m', date: '$date' } },
                        moment().format('YYYY-MM'),
                      ],
                    },
                    { $lt: ['$amount', 0] },
                  ],
                },
                then: '$amount',
                else: 0,
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          income: {
            $round: ['$income', ROUND_VALUE],
          },
          expenses: {
            $round: ['$expenses', ROUND_VALUE],
          },
          byDay: {
            $round: ['$byDay', ROUND_VALUE],
          },
          byWeek: {
            $round: ['$byWeek', ROUND_VALUE],
          },
          byMonth: {
            $round: ['$byMonth', ROUND_VALUE],
          },
        },
      },
    ]);

    const { income, expenses, byDay, byWeek, byMonth } = data[0] ?? {
      income: 0,
      expenses: 0,
      byDay: 0,
      byWeek: 0,
      byMonth: 0,
    };

    const budgetByUser =
      await this.budgetService.getUserBudgetForCurrentMonthByUserID(userID);
    const daysInCurrentMonth = moment().daysInMonth();
    return {
      income,
      expenses,
      byDay: {
        amount: byDay,
        // difference Btw Budget And Costs
        percentage: `${budgetByUser ? this.calcPercentage(
          budgetByUser.perDay + byDay,
          budgetByUser.perDay,
        ) : 0}%`,
      },
      byWeek: {
        amount: byWeek,
        percentage: `${budgetByUser ? this.calcPercentage(
          budgetByUser.perDay * 7 + byWeek,
          budgetByUser.perDay * 7,
        ) : 0}%`,
      },
      byMonth: {
        amount: byMonth,
        percentage: `${budgetByUser ? this.calcPercentage(
          budgetByUser.perDay * daysInCurrentMonth + byMonth,
          budgetByUser.perDay * daysInCurrentMonth,
        ) : 0}%`,
      },
    };
  }

  async getFilteredAccounts(
    filter: string,
    orderBy: string,
    userID: string,
  ) {
    // .find({ $and: buildFilterObject, userID })
    // const buildFilterObject = buildFilterExpressions(filter);
    // const sortValue = buildSortByOrderBy(orderBy);
    return await this.accountsRepo.aggregate([
      {
        $match: {
          $expr: {
            $and: [{ $eq: ['$userID', { $toObjectId: userID }] }],
          },
        },
      },
      {
        $lookup: {
          from: 'transactions',
          let: { account_id: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$accountID', '$$account_id'] }],
                },
              },
            },
            ...this.amountSumAggregationStages,
          ],
          as: 'totalAmount',
        },
      },
      {
        $project: {
          _id: { $toString: '$_id' },
          name: 1,
          description: 1,
          currency: 1,
          type: 1,
          ballance: { $ifNull: [{ $first: '$totalAmount.value' }, 0] },
        },
      },
    ]);
  }

  async getAccountById(accountID: string) {
    return await this.accountsRepo.findOne({ _id: accountID });
  }
}
