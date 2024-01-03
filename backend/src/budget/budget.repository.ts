import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { Budget, BudgetDocument } from './schemas/budget.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class BudgetRepository extends AbstractRepository<BudgetDocument> {
  protected readonly logger = new Logger(BudgetRepository.name);

  constructor(
    @InjectModel(Budget.name)
    budgetModel: Model<BudgetDocument>,
  ) {
    super(budgetModel);
  }
}
