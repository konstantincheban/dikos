import { StatisticsService } from '@statistics/statistics.service';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountsService } from '@accounts/accounts.service';
import { buildFilterExpressions, buildSortByOrderBy } from '@utils/utils';
import { CreateTransactionDTO } from './dto/create-transaction.dto';
import { EditTransactionDTO } from './dto/edit-transaction.dto';
import {
  Transaction,
  TransactionDocument,
} from './schemas/transactions.schema';
import { ProposedCategoryDTO } from './dto/proposed-category.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<TransactionDocument>,
    private readonly statisticsService: StatisticsService,
    private readonly accountsService: AccountsService,
  ) {}

  async createTransaction(
    data: CreateTransactionDTO,
  ): Promise<TransactionDocument> {
    const relatedAccount = await this.accountsService.getAccountById(
      data.accountID,
    );
    if (relatedAccount.currency !== data.currency) {
      throw new BadRequestException(
        `Transaction currency is not equal to the currency of the associated Account [${relatedAccount.name}]`,
      );
    }
    return await new this.transactionModel(data).save();
  }

  async editTransaction(
    transactionID: string,
    data: EditTransactionDTO,
  ): Promise<TransactionDocument> {
    try {
      const updatedTransaction = await this.transactionModel.findByIdAndUpdate(
        transactionID,
        { $set: data },
        { new: true },
      );
      return updatedTransaction;
    } catch (err) {
      throw new BadRequestException('Something went wrong. Please try again');
    }
  }

  async deleteTransaction(transactionID: string) {
    try {
      await this.transactionModel.findByIdAndRemove(transactionID);
      return { message: 'Transaction entry was removed successfully' };
    } catch (err) {
      throw new BadRequestException('Something went wrong. Please try again');
    }
  }

  async getTransactionProposedCategories(userID: string, top: number): Promise<ProposedCategoryDTO[]> {
    const topCategories = await this.statisticsService.getTopCategoriesStatisticsData(userID, top);
    return topCategories.map(category => ({ label: category.name, value: category.name }));
  }

  async getFilteredTransactions(
    filter: string,
    orderBy: string,
    top: number,
    userID: string,
  ): Promise<Transaction[]> {
    const buildFilterObject = buildFilterExpressions(filter);
    const sortValue = buildSortByOrderBy(orderBy);
    return await this.transactionModel
      .find({ $and: buildFilterObject, userID })
      .sort(sortValue)
      .limit(top);
  }
}
