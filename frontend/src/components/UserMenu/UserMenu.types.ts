// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUserMenuProps {}
export interface ISummaryWidgetConfig {
  name: string;
  amount: number;
  currency: string;
}
export interface IDateSummaryWidgetConfig {
  name: string;
  amount: number;
  currency: string;
  percentage: number;
  icon: React.ReactElement;
}
