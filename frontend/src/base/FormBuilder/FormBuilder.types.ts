import { IInputProps } from '@base/Input';
import { IOptionProps, ISelectProps } from '@base/Select';

export interface IFormBuilderProps<FormData> {
  initialData: FormData;
  validationSchema?: unknown;
  containerClassName: string;
  controls: ControlProps[];
  onSubmit: (values: FormData) => void;
  onChange: (values: FormData, isValid: boolean) => void;
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
};

type PossibleControls = IInputControlProps | ISelectControlProps;

export type IInputControlProps = IInputProps & {
  type: 'input';
};

export type ISelectControlProps = Omit<
  ISelectProps,
  'className' | 'onChange'
> & {
  type: 'select';
  options: ISelectOptionControlProps[];
};
export type ISelectOptionControlProps = Pick<IOptionProps, 'value' | 'label'>;
