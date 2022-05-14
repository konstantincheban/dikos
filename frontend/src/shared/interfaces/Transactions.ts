export interface ITransaction {
  id: string;
  accountID: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  category: string;
  date: Date;
  paymaster: string;
  created_at: Date;
  updated_at: Date;
}

export type CreateTransactionRequest = Omit<
  ITransaction,
  'id' | 'created_at' | 'updated_at'
>;

export type EditTransactionRequest = Omit<
  ITransaction,
  'id' | 'created_at' | 'updated_at' | 'accountID'
>;
