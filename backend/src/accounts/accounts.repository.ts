import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { Account, AccountDocument } from './schemas/accounts.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AccountsRepository extends AbstractRepository<AccountDocument> {
  protected readonly logger = new Logger(AccountsRepository.name);

  constructor(
    @InjectModel(Account.name)
    accountModel: Model<AccountDocument>,
  ) {
    super(accountModel);
  }
}
