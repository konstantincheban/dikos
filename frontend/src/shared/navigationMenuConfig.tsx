import { HistoryIcon, HomeIcon } from '@base/Icon/IconSet';

export interface INavigationItemConfig {
  label: string;
  path: string;
  icon: React.ReactElement;
}

export const navigationMenuConfig: INavigationItemConfig[] = [
  {
    label: 'Summary',
    path: '/',
    icon: <HomeIcon />,
  },
  {
    label: 'Finance History',
    path: '/transactions',
    icon: <HistoryIcon />,
  },
];
