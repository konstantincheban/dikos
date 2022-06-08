import { FileUploaderProps } from '@base/FileUploader/FileUploader.types';
import { IInputProps } from '@base/Input';
import { IOptionProps, ISelectProps } from '@base/Select';

export interface IFormBuilderProps<FormData> {
  initialData: FormData;
  validationSchema?: unknown;
  containerClassName: string;
  controls: ControlProps[];
  onSubmit: (values: FormData) => void;
  onBlurValidate: (isValid: boolean) => void;
}

export type ControlProps = GenericControlProps<PossibleControls>;

type GenericControlProps<ControlType> = {
  [Property in keyof ControlType]: ControlType[Property];
} & CommonProperties;

type CommonProperties = {
  label: string;
  name: string;
  required?: boolean;
  description?: string;
};

type PossibleControls =
  | InputControlProps
  | InputFileControlProps
  | SelectControlProps
  | DatePickerControlProps;

export type InputControlProps = IInputProps & {
  controlType: 'input';
};

export type InputFileControlProps = FileUploaderProps & {
  controlType: 'file';
};

export type SelectControlProps = Omit<
  ISelectProps,
  'className' | 'onChange'
> & {
  controlType: 'select';
  options: SelectOptionControlProps[];
};
export type SelectOptionControlProps = Pick<IOptionProps, 'value' | 'label'>;

export type DatePickerControlProps = {
  controlType: 'datepicker';
  placeholder?: string;
  initialDate?: Date;
};

// Reference types
export type FormBuilderRef = {
  submitForm: () => void;
};
