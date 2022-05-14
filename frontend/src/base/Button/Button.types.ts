import { ButtonHTMLAttributes } from 'react';

export interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactElement | React.ReactElement[];
  secondary?: Boolean;
  disruptive?: Boolean;
}
