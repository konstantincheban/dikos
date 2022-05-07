import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDTO } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(data: CreateUserDTO): Promise<UserDocument> {
    return await new this.userModel(data).save();
  }

  async getUserByEmail(email: string): Promise<UserDocument | undefined> {
    return await this.userModel.findOne({ email }).exec();
  }

  async getAllUsers(): Promise<UserDocument[]> {
    return await this.userModel.find().exec();
  }
}
