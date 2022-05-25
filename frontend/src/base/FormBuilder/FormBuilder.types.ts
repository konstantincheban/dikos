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
  | IInputControlProps
  | IInputFileControlProps
  | ISelectControlProps;

export type IInputControlProps = IInputProps & {
  controlType: 'input';
};

export type IInputFileControlProps = FileUploaderProps & {
  controlType: 'file';
};

export type ISelectControlProps = Omit<
  ISelectProps,
  'className' | 'onChange'
> & {
  controlType: 'select';
  options: ISelectOptionControlProps[];
};
export type ISelectOptionControlProps = Pick<IOptionProps, 'value' | 'label'>;

// Reference types
export type FormBuilderRef = {
  submitForm: () => void;
};
