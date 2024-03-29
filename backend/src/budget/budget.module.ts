import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '@auth/auth.module';
import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';
import { Budget, BudgetSchema } from './schemas/budget.schema';
import { DatabaseModule, LoggerModule } from '@app/common';
import { BudgetRepository } from './budget.repository';

@Module({
  imports: [
    LoggerModule,
    forwardRef(() => AuthModule),
    DatabaseModule.forFeature([{ name: Budget.name, schema: BudgetSchema }]),
  ],
  providers: [BudgetService, BudgetRepository],
  controllers: [BudgetController],
  exports: [BudgetService, BudgetRepository],
})
export class BudgetModule {}
