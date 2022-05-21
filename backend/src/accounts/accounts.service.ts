import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { buildFilterExpressions } from 'src/utils/utils';
import { CreateAccountDTO } from './dto/create-account.dto';
import { EditAccountDTO } from './dto/edit-account.dto';
import { Account, AccountDocument } from './schemas/accounts.schema';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(Account.name)
    private readonly accountModel: Model<AccountDocument>,
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
      return { message: 'Account was removed successfully' };
    } catch (err) {
      throw new BadRequestException('Something went wrong. Please try again');
    }
  }

  async getFilteredAccounts(
    filter: string,
    userID: string,
  ): Promise<Account[]> {
    const buildFilterObject = buildFilterExpressions(filter);
    return await this.accountModel
      .find({ $and: buildFilterObject, userID })
      .exec();
  }

  async getAccountById(accountID: string) {
    return await this.accountModel.findById(accountID);
  }
}
