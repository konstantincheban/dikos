export interface ISwitcherProps {
  options: ISwitcherOption[];
  value?: string;
  onChange?: (value: string) => void;
}

export interface ISwitcherOption {
  value: string;
  label: string;
}
