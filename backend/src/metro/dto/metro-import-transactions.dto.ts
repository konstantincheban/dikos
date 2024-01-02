import { METRO_AGGR_TYPES } from "@metro/metro.service";
import { Type } from "class-transformer";
import { IsDate, IsIn, IsString } from "class-validator";

export class MetroTransactionsFileDTO {
  @IsString()
  accountID: string;

  @IsIn(METRO_AGGR_TYPES)
  aggregationType: string;

  @IsDate()
  @Type(() => Date)
  date: string;
}
