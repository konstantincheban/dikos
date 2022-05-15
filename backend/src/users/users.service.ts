import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountsService } from 'src/accounts/accounts.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserDataDTO } from './dto/userData.dto';
import { User, UserDocument } from './schemas/users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly accountsService: AccountsService,
  ) {}

  computeUserData(user: UserDocument): UserDataDTO {
    const { id, username, email } = user;
    return {
      userId: id,
      username,
      email,
    };
  }

  async createUser(data: CreateUserDTO): Promise<UserDocument> {
    const user = await new this.userModel(data).save();

    // create default account for the user
    const defaultAccountData = this.accountsService.defaultAccountData;
    this.accountsService.createAccount({
      ...defaultAccountData,
      userID: user.id,
    });

    return user;
  }

  async getUserByEmail(email: string): Promise<UserDocument | undefined> {
    return await this.userModel.findOne({ email }).exec();
  }

  async getUserData(userID): Promise<UserDataDTO | undefined> {
    const user = await this.userModel.findOne({ userID }).exec();
    if (user) return this.computeUserData(user);
    throw new UnauthorizedException();
  }
}
