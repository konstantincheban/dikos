import { InputHTMLAttributes } from "react";

export interface ICheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange: (checkState: boolean) => void;
}
