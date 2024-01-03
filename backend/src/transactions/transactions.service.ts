import { StatisticsService } from '@statistics/statistics.service';
import { Injectable, BadRequestException } from '@nestjs/common';
import { AccountsService } from '@accounts/accounts.service';
import { CreateTransactionDTO } from './dto/create-transaction.dto';
import { EditTransactionDTO } from './dto/edit-transaction.dto';
import { TransactionDocument } from './schemas/transactions.schema';
import { TransactionsRepository } from './transactions.repository';
import { IOptions } from '@app/common';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly statisticsService: StatisticsService,
    private readonly accountsService: AccountsService,
  ) {}

  async createTransaction(
    data: CreateTransactionDTO & { userID: string },
  ): Promise<TransactionDocument> {
    const relatedAccount = await this.accountsService.getAccountById(
      data.accountID,
    );
    if (relatedAccount.currency !== data.currency) {
      throw new BadRequestException(
        `Transaction currency is not equal to the currency of the associated Account [${relatedAccount.name}]`,
      );
    }
    return await this.transactionsRepository.create(data);
  }

  async editTransaction(
    transactionID: string,
    data: EditTransactionDTO,
  ): Promise<TransactionDocument> {
    try {
      const updatedTransaction =
        await this.transactionsRepository.findOneAndUpdate(
          { _id: transactionID },
          { $set: data },
        );
      return updatedTransaction;
    } catch (err) {
      throw new BadRequestException('Something went wrong. Please try again');
    }
  }

  async deleteTransaction(transactionID: string) {
    try {
      this.transactionsRepository.findOneAndDelete({ _id: transactionID });
      return { message: 'Transaction entry was removed successfully' };
    } catch (err) {
      throw new BadRequestException('Something went wrong. Please try again');
    }
  }

  async getTransactionProposedCategories(userID: string, top: number) {
    const topCategories =
      await this.statisticsService.getTopCategoriesStatisticsData(userID, top);
    return topCategories.map((category) => ({
      label: category.name,
      value: category.name,
    }));
  }

  async deleteTransactions(transactionIDs: string[]) {
    const statuses = await Promise.allSettled(
      transactionIDs.map(async (id) => {
        try {
          await this.transactionsRepository.findOneAndDelete({ _id: id });
          return Promise.resolve(id);
        } catch (err) {
          return Promise.reject({ id, desc: err.name });
        }
      }),
    );

    return statuses.map((status) => {
      if (status.status === 'rejected') {
        return {
          id: status.reason.id,
          status: 'failed',
          reason: status.reason.desc,
        };
      }

      return {
        id: status.value,
        status: 'success',
      };
    });
  }

  async getTransactions(options: IOptions) {
    return this.transactionsRepository.findAll(options);
  }

  async getTransactionsCount(options: IOptions) {
    return this.transactionsRepository.findAll({ ...options, count: true });
  }
}
