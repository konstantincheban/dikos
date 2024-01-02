import { BudgetService } from '@budget/budget.service';
import { Injectable } from '@nestjs/common';
import { AccountsService } from '@accounts/accounts.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserDocument } from './schemas/users.schema';
import { UsersRepository } from './users.repository';

interface IUserData {
  username: string;
  email: string;
}


@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly accountsService: AccountsService,
    private readonly budgetService: BudgetService,
  ) {}

  computeUserData(user: UserDocument): IUserData {
    const { username, email } = user;
    return {
      username,
      email,
    };
  }

  async createUser(data: CreateUserDTO): Promise<UserDocument> {
    const user = await this.usersRepository.create(data);

    // create default account for the user
    const defaultAccountData = this.accountsService.defaultAccountData;
    await this.accountsService.createAccount({
      ...defaultAccountData,
      userID: user._id,
    });

    // create budget entry for the new user
    const defaultUserBudget = this.budgetService.defaultUserBudget;
    const createdBudget = await this.budgetService.createUserBudget(
      defaultUserBudget,
      user.id,
    );

    const userWithBudget = await this.usersRepository.findOneAndUpdate(
      { _id: user.id },
      { $set: { budgetID: createdBudget._id } }
    );

    return userWithBudget;
  }

  async getUserByEmail(email: string): Promise<UserDocument | undefined> {
    return this.usersRepository.findOne({ email });
  }

  async getUserData(userID): Promise<UserDocument> {
    return await this.usersRepository.findOne({ _id: userID });
  }
}
