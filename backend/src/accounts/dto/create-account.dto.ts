import { ACCOUNT_TYPES } from '@utils/constants';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class CreateAccountDTO {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  currency: string;

  @IsIn(ACCOUNT_TYPES)
  type: string;
}
