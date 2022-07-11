import { FileUploaderProps } from '@base/FileUploader/FileUploader.types';
import { IInputProps } from '@base/Input';
import { IOptionProps, ISelectProps } from '@base/Select';
import { ISwitcherProps } from '@base/Switcher';
import { ITagEditorSingleModeProps } from '@base/TagEditor/TagEditor.types';

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
  | TagEditorControlProps
  | SwitcherControlProps
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

export type TagEditorControlProps = Omit<
  ITagEditorSingleModeProps,
  'singleTagMode' | 'onChange'
> & {
  controlType: 'tagEditor';
};

export type DatePickerControlProps = {
  controlType: 'datepicker';
  placeholder?: string;
  initialDate?: Date;
};

export type SwitcherControlProps = Omit<ISwitcherProps, 'onChange'> & {
  controlType: 'switcher';
};

// Reference types
export type FormBuilderRef = {
  submitForm: () => void;
};
