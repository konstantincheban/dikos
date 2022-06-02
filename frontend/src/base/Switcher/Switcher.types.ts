export interface ISwitcherProps {
  value: string;
  options: ISwitcherOption[];
  onChange: (value: string) => void;
}

export interface ISwitcherOption {
  value: string;
  label: string;
}
