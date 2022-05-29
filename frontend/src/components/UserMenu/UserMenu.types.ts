// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUserMenuProps {}
export interface ISummaryWidgetConfig {
  ref: 'income' | 'outcome';
  name: string;
  amount: number;
  currency: string;
}
export interface IDateSummaryWidgetConfig {
  ref: 'byWeek' | 'byMonth' | 'byYear';
  name: string;
  amount: number;
  currency: string;
  icon: React.ReactElement;
}
