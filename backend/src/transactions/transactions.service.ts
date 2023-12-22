import { StatisticsService } from '@statistics/statistics.service';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Query } from 'mongoose';
import { AccountsService } from '@accounts/accounts.service';
import { buildFilterExpressions, buildSortByOrderBy } from '@utils/utils';
import { CreateTransactionDTO } from './dto/create-transaction.dto';
import { EditTransactionDTO } from './dto/edit-transaction.dto';
import {
  Transaction,
  TransactionDocument,
} from './schemas/transactions.schema';
import { ProposedCategoryDTO } from './dto/proposed-category.dto';
import { DeleteTransactionsStatusDTO } from './dto/delete-transactions-status.dto';

interface ICount {
  count: number
}

interface IOptions {
  find?: any,
  sort?: any,
  select?: any,
  top?: number,
  count?: boolean
}

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
      this.transactionModel.findByIdAndRemove(transactionID);
      return { message: 'Transaction entry was removed successfully' };
    } catch (err) {
      throw new BadRequestException('Something went wrong. Please try again');
    }
  }


  async getTransactionProposedCategories(userID: string, top: number): Promise<ProposedCategoryDTO[]> {
    const topCategories = await this.statisticsService.getTopCategoriesStatisticsData(userID, top);
    return topCategories.map(category => ({ label: category.name, value: category.name }));
  }

  async deleteTransactions(transactionIDs: string[]): Promise<DeleteTransactionsStatusDTO[]> {
    const statuses = await Promise.allSettled(transactionIDs.map(async (id) => {
      try {
        await this.transactionModel.findByIdAndRemove(id).exec();
        return Promise.resolve(id);
      } catch (err) {
        return Promise.reject({ id, desc: err.name });
      }
    }));

    return statuses.map(status => {
      if (status.status === 'rejected') {
        return {
          id: status.reason.id,
          status: 'failed',
          reason: status.reason.desc
        }
      }

      return {
        id: status.value,
        status: 'success'
      }
    })
  }

  // Overload signatures
  async getFilteredTransactions(userID: string, filter: any | undefined, orderBy: any | undefined, top: number | undefined, count: true): Promise<ICount>;
  async getFilteredTransactions(userID: string, filter?: any, orderBy?: any, top?: number, count?: boolean): Promise<Transaction[]>;

  async getFilteredTransactions(
    userID: string,
    filter?: any,
    orderBy?: any,
    top?: number,
    count?: boolean
  ): Promise<Transaction[] | ICount> {
    const buildFilterObject = buildFilterExpressions(filter);
    const sortValue = buildSortByOrderBy(orderBy);
    let query = this.transactionModel.find({ $and: buildFilterObject, userID });
    if (orderBy) {
      query = query.sort(sortValue);
    }
    if (top) {
      query = query.limit(top);
    }
    if (count) {
      return {
        count: await query.countDocuments()
      }
    }
    return await query;
  }

  // Overload signatures
  async getTransactions(userID: string, options: IOptions & { count: true }): Promise<ICount>;
  async getTransactions(userID: string, options: IOptions): Promise<Partial<Transaction>[]>;

  async getTransactions(
    userID: string,
    options: IOptions
  ): Promise<ICount | Partial<Transaction>[]> {
    const {
      find,
      sort,
      select,
      top,
      count
    } = options;
    let query = this.transactionModel.find({ ...(find ?? {}), userID });
    if (sort) {
      query = query.sort(sort);
    }
    if (select) {
      query = query.select(select);
    }
    if (top) {
      query = query.limit(top);
    }
    if (count) {
      return {
        count: await query.countDocuments()
      }
    }
    return await query;
  }
}
