export interface IAccount {
  _id: string;
  name: string;
  description: string;
  currency: string;
  type: string;
  ballance: number;
  created_at: Date;
  updated_at: Date;
}

export type CreateAccountRequest = Omit<
  IAccount,
  '_id' | 'created_at' | 'updated_at' | 'ballance'
>;

export type EditAccountRequest = Pick<IAccount, 'name' | 'description'>;

export type AccountSummaryData = {
  income: number;
  expenses: number;
  byDay: ByDateRangeSummary;
  byWeek: ByDateRangeSummary;
  byMonth: ByDateRangeSummary;
};

export type ByDateRangeSummary = {
  amount: number;
  percentage: string;
};
