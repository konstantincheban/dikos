import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { buildFilterExpressions } from 'src/utils/utils';
import { CreateTransactionDTO } from './dto/create-transaction.dto';
import { EditTransactionDTO } from './dto/edit-transaction.dto';
import {
  Transaction,
  TransactionDocument,
} from './schemas/transactions.schema';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<TransactionDocument>,
  ) {}

  async createTransaction(
    data: CreateTransactionDTO,
  ): Promise<TransactionDocument> {
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

  async getFilteredAccounts(
    filter: string,
    userID: string,
  ): Promise<Transaction[]> {
    const buildFilterObject = buildFilterExpressions(filter);
    return await this.transactionModel
      .find({ $and: buildFilterObject, userID })
      .exec();
  }
}
