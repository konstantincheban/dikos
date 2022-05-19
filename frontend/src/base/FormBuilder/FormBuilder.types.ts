import { IInputProps } from '@base/Input';

export interface IFormBuilderProps<FormData> {
  initialData: FormData;
  validationSchema?: unknown;
  containerClassName: string;
  controls: IControlProps[];
  onSubmit: (values: FormData) => void;
  onChange: (values: FormData, isValid: boolean) => void;
  onBlurValidate: (isValid: boolean) => void;
}

export interface IControlProps extends IInputProps {
  label: string;
  name: string;
  required?: boolean;
}
