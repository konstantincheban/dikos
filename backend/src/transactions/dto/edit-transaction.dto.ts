export class EditTransactionDTO {
  name?: string;
  description?: string;
  amount: number;
  currency: string;
  category?: string;
  date?: Date;
  paymaster?: string;
}
