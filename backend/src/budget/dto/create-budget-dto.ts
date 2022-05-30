import { BudgetPerMonthDTO } from './get-budget-dto';

export class CreateBudgetDTO {
  userID: string;
  budgetsPerMonth: BudgetPerMonthDTO[];
}
