import { PartialType } from "@nestjs/mapped-types";
import { CreateTransactionDTO } from "./create-transaction.dto";

export class EditTransactionDTO extends PartialType(CreateTransactionDTO) {};
