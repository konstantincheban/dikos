import { TransactionDocument } from './../../transactions/schemas/transactions.schema';
export class ImportedStatusDTO {
  statuses?: PromiseSettledResult<TransactionDocument>;
  message: string;
}
