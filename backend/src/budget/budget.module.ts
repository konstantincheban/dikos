import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '@auth/auth.module';
import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';
import { Budget, BudgetSchema } from './schemas/budget.schema';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([{ name: Budget.name, schema: BudgetSchema }]),
  ],
  providers: [BudgetService],
  controllers: [BudgetController],
  exports: [BudgetService],
})
export class BudgetModule {}
