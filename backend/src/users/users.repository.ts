import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { User, UserDocument } from './schemas/users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersRepository extends AbstractRepository<UserDocument> {
  protected readonly logger = new Logger(UsersRepository.name);

  constructor(
    @InjectModel(User.name)
    usersModel: Model<UserDocument>,
  ) {
    super(usersModel);
  }
}
