import { Field, Form, Formik, FormikProps } from 'formik';
import { classMap } from '@shared/utils';
import Input from '@base/Input';
import {
  ControlProps,
  IFormBuilderProps,
  SelectControlProps,
  SelectOptionControlProps,
} from './FormBuilder.types';
import './FormBuilder.scss';
import { Select, Option } from '@base/Select';
import FileUploader from '@base/FileUploader';
import { createRef, forwardRef, useImperativeHandle } from 'react';
import { InfoIcon } from '@base/Icon/IconSet';
import Icon from '@base/Icon';
import Tooltip from '@base/Tooltip';
import DatePicker from '@base/DatePicker';

function FormBuilder<FormData>(
  props: IFormBuilderProps<FormData>,
  ref: React.ForwardedRef<any>,
) {
  const {
    initialData,
    validationSchema,
    onSubmit,
    onBlurValidate,
    controls,
    containerClassName,
  } = props;

  const formRef = createRef<FormikProps<FormData>>();

  useImperativeHandle(ref, () => ({
    submitForm: () => formRef?.current?.handleSubmit(),
  }));

  const renderInputControl = ({ controlType, ...control }: ControlProps) => {
    return <Field as={Input} {...control} />;
  };
  const renderSelectControl = ({
    options,
    controlType,
    ...control
  }: SelectControlProps) => {
    return (
      <Field as="select" component={Select} {...control}>
        {options.map((option: SelectOptionControlProps, key: number) => (
          <Option key={`${option.label}_${key}`} {...option}></Option>
        ))}
      </Field>
    );
  };
  const renderFileControl = ({ controlType, ...control }: ControlProps) => {
    return <Field as="file" component={FileUploader} {...control} />;
  };

  const renderDatePickerControl = ({
    controlType,
    ...control
  }: ControlProps) => {
    return <Field as="datepicker" component={DatePicker} {...control} />;
  };

  const renderControlByType = (control: ControlProps) => {
    if (control.controlType === 'input') return renderInputControl(control);
    if (control.controlType === 'select') return renderSelectControl(control);
    if (control.controlType === 'file') return renderFileControl(control);
    if (control.controlType === 'datepicker')
      return renderDatePickerControl(control);
  };

  const renderSection = (control: ControlProps, key: number, errors: any) => {
    return (
      <div key={`${control.name}`} className="Section">
        <label className="FieldLabel" htmlFor={control.name}>
          {control.label}
          {control.required ? ' * ' : ''}
          {control.description ? (
            <Tooltip content={control.description}>
              <Icon size={13} className="InfoIconCommon" icon={<InfoIcon />} />
            </Tooltip>
          ) : (
            ''
          )}
          {`:`}
        </label>
        {renderControlByType(control)}
        <span className="error-msg">{errors[control.name]}</span>
      </div>
    );
  };

  const handleSubmitForm = (values: FormData) => {
    onSubmit(values);
  };

  return (
    <div className="FormBuilderContainer">
      <Formik
        innerRef={formRef}
        validateOnBlur
        validateOnChange
        initialValues={initialData}
        validationSchema={validationSchema}
        onSubmit={handleSubmitForm}
      >
        {({ isValid, errors }) => (
          <Form
            onBlur={() => onBlurValidate(isValid)}
            onChange={() => onBlurValidate(isValid)}
            className={classMap({ [containerClassName]: !!containerClassName })}
          >
            {controls.map((control, key) =>
              renderSection(control, key, errors),
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
}

const FormBuilderRef = forwardRef(FormBuilder) as <T>(
  props: IFormBuilderProps<T> & { ref?: React.ForwardedRef<any> },
) => ReturnType<typeof FormBuilder>;

export default FormBuilderRef;
