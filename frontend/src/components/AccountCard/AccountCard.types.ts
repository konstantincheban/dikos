import { AccountActions } from '@components/AccountsView/AccountsView.types';

export interface IAccountCardProps {
  _id: string;
  name: string;
  description: string;
  currency: string;
  ballance?: number;
  className?: string;
  actions?: AccountActions[];
  onClick?: () => void;
}
export interface ICreateAccountCardProps {
  className?: string;
  onClick?: () => void;
}
