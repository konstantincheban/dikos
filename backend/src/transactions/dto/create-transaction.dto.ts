export class CreateTransactionDTO {
  userID: string;
  accountID: string;
  name?: string;
  description?: string;
  amount: number;
  currency: string;
  category?: string;
  date?: string;
  paymaster?: string;
}
