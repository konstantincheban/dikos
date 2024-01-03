import { Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

export class MonoTransactionsFileDTO {
  @IsString()
  accountID: string;

  @IsDate()
  @Type(() => Date)
  date: Date;
}
