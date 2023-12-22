// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUserMenuProps {}
export interface ISummaryWidgetConfig {
  ref: 'income' | 'expenses';
  name: string;
  amount: number;
  currency: string;
}
export interface IDateSummaryWidgetConfig {
  ref: 'byDay' | 'byWeek' | 'byMonth';
  name: string;
  amount: number;
  percentage: string;
  currency: string;
  icon: React.ReactElement;
}
