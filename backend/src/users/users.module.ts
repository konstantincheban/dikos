import { BudgetModule } from './../budget/budget.module';
import { AccountsModule } from './../accounts/accounts.module';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/users.schema';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => AccountsModule),
    forwardRef(() => BudgetModule),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
