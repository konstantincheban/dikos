export interface IAccount {
  _id: string;
  name: string;
  description: string;
  currency: string;
  type: string;
  created_at: Date;
  updated_at: Date;
}

export type CreateAccountRequest = Omit<
  IAccount,
  '_id' | 'created_at' | 'updated_at'
>;

export type EditAccountRequest = Pick<IAccount, 'name' | 'description'>;
