import { BudgetService } from '@budget/budget.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountsService } from '@accounts/accounts.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserDataDTO } from './dto/userData.dto';
import { User, UserDocument } from './schemas/users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly accountsService: AccountsService,
    private readonly budgetService: BudgetService,
  ) {}

  computeUserData(user: UserDocument): UserDataDTO {
    const { username, email } = user;
    return {
      username,
      email,
    };
  }

  async createUser(data: CreateUserDTO): Promise<UserDocument> {
    const user = await new this.userModel(data).save();

    // create default account for the user
    const defaultAccountData = this.accountsService.defaultAccountData;
    await this.accountsService.createAccount({
      ...defaultAccountData,
      userID: user.id,
    });

    // create budget entry for the new user
    const defaultUserBudget = this.budgetService.defaultUserBudget;
    const createdBudget = await this.budgetService.createUserBudget(
      defaultUserBudget,
      user.id,
    );

    const userWithBudget = await this.userModel.findByIdAndUpdate(
      user.id,
      { $set: { budgetID: createdBudget._id } },
      { new: true },
    );

    return userWithBudget;
  }

  async getUserByEmail(email: string): Promise<UserDocument | undefined> {
    return await this.userModel.findOne({ email }).exec();
  }

  async getUserData(userID): Promise<UserDocument> {
    return await this.userModel.findById(userID).exec();
  }
}
