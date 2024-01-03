import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import {
  Transaction,
  TransactionDocument,
} from './schemas/transactions.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TransactionsRepository extends AbstractRepository<TransactionDocument> {
  protected readonly logger = new Logger(TransactionsRepository.name);

  constructor(
    @InjectModel(Transaction.name)
    transactionsModel: Model<TransactionDocument>,
  ) {
    super(transactionsModel);
  }
}
