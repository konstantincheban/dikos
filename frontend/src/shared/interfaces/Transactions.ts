export interface ITransaction {
  _id: string;
  accountID: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  category: string;
  date: string;
  paymaster: string;
  created_at: string;
  updated_at: string;
}

export type CreateTransactionRequest = Omit<
  ITransaction,
  '_id' | 'created_at' | 'updated_at'
>;

export type EditTransactionRequest = Omit<
  ITransaction,
  '_id' | 'created_at' | 'updated_at' | 'accountID'
>;
