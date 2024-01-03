import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional } from 'class-validator';

export class CreateBudgetDTO {
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  date?: Date;

  @IsNumber()
  amount: number;

  @IsNumber()
  plannedCosts: number;

  @IsNumber()
  perDay: number;
}
