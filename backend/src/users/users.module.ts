import { BudgetModule } from '@budget/budget.module';
import { AccountsModule } from '@accounts/accounts.module';
import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '@auth/auth.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/users.schema';
import { DatabaseModule } from '@app/common';
import { UsersRepository } from './users.repository';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => AccountsModule),
    forwardRef(() => BudgetModule),
    DatabaseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
