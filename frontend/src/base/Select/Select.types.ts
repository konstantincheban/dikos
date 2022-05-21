export interface ISelectProps {
  readOnly?: boolean;
  removeMode?: boolean;
  name?: string;
  value?: string;
  className?: string;
  onChange?: (value: string) => void;
}

export interface IOptionProps {
  label: string;
  value: string;
  active?: boolean;
  collapsed?: boolean;
  onSelect?: (value: string) => void;
}
