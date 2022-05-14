export interface ITabsProps {
  tabs: ITab[];
  currentTab?: string;
}

export interface ITab {
  name: string;
  path: string;
  disabled?: Boolean;
}
