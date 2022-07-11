import { ButtonHTMLAttributes } from 'react';

export interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactElement | React.ReactElement[];
  secondary?: boolean;
  disruptive?: boolean;
  size?: 'default' | 'small';
  icon?: React.ReactElement;
}
