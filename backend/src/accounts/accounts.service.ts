import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Transaction,
  TransactionDocument,
} from 'src/transactions/schemas/transactions.schema';
import { buildFilterExpressions, buildSortByOrderBy } from 'src/utils/utils';
import { AccountSummaryDTO } from './dto/account-summary-dto';
import { CreateAccountDTO } from './dto/create-account.dto';
import { EditAccountDTO } from './dto/edit-account.dto';
import { Account, AccountDocument } from './schemas/accounts.schema';
import * as moment from 'moment';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(Account.name)
    private readonly accountModel: Model<AccountDocument>,
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<TransactionDocument>,
  ) {}

  get defaultAccountData(): Omit<CreateAccountDTO, 'userID'> {
    return {
      name: 'Default',
      description: 'Default Account',
      currency: 'UAH',
      type: 'default',
    };
  }

  async createAccount(data: CreateAccountDTO): Promise<AccountDocument> {
    return await new this.accountModel(data).save();
  }

  async editAccount(
    accountID: string,
    data: EditAccountDTO,
  ): Promise<AccountDocument> {
    try {
      const updatedAccount = await this.accountModel.findByIdAndUpdate(
        accountID,
        { $set: data },
        { new: true },
      );
      return updatedAccount;
    } catch (err) {
      throw new BadRequestException('Something went wrong. Please try again');
    }
  }

  async deleteAccount(accountID: string) {
    try {
      await this.accountModel.findByIdAndRemove(accountID);
      await this.transactionModel.deleteMany({ accountID: accountID });
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
              1,
            ],
          },
        },
      },
    ];
  }

  async getAccountSummary(accountID: string): Promise<AccountSummaryDTO> {
    const income = await this.transactionModel.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $gt: ['$amount', 0] },
              { $eq: ['$accountID', { $toObjectId: accountID }] },
            ],
          },
        },
      },
      ...this.amountSumAggregationStages,
    ]);
    const outcome = await this.transactionModel.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $lt: ['$amount', 0] },
              { $eq: ['$accountID', { $toObjectId: accountID }] },
            ],
          },
        },
      },
      ...this.amountSumAggregationStages,
    ]);
    const byWeek = await this.transactionModel.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              {
                $eq: [{ $isoWeek: '$date' }, moment().isoWeek()],
              },
              { $eq: ['$accountID', { $toObjectId: accountID }] },
            ],
          },
        },
      },
      ...this.amountSumAggregationStages,
    ]);
    const byMonth = await this.transactionModel.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              {
                $eq: [
                  { $dateToString: { format: '%Y-%m', date: '$date' } },
                  moment().format('YYYY-MM'),
                ],
              },
              { $eq: ['$accountID', { $toObjectId: accountID }] },
            ],
          },
        },
      },
      ...this.amountSumAggregationStages,
    ]);
    const byYear = await this.transactionModel.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              {
                $eq: [
                  { $dateToString: { format: '%Y', date: '$date' } },
                  moment().format('YYYY'),
                ],
              },
              { $eq: ['$accountID', { $toObjectId: accountID }] },
            ],
          },
        },
      },
      ...this.amountSumAggregationStages,
    ]);

    return {
      income: income.length ? income[0].value : 0,
      outcome: outcome.length ? outcome[0].value : 0,
      byWeek: byWeek.length ? byWeek[0].value : 0,
      byMonth: byMonth.length ? byMonth[0].value : 0,
      byYear: byYear.length ? byYear[0].value : 0,
    };
  }

  async getFilteredAccounts(
    filter: string,
    orderBy: string,
    userID: string,
  ): Promise<Account[]> {
    // .find({ $and: buildFilterObject, userID })
    // const buildFilterObject = buildFilterExpressions(filter);
    // const sortValue = buildSortByOrderBy(orderBy);
    return await this.accountModel.aggregate([
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
    return await this.accountModel.findById(accountID);
  }
}
