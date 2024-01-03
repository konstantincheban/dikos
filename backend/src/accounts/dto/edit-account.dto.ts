import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountDTO } from './create-account.dto';

export class EditAccountDTO extends PartialType(CreateAccountDTO) {}
