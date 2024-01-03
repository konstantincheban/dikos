import { IsNumber } from 'class-validator';

export class EditBudgetDTO {
  @IsNumber()
  amount: number;

  @IsNumber()
  plannedCosts: number;
}
