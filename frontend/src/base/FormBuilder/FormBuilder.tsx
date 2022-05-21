import { Field, Form, Formik } from 'formik';
import { classMap } from '@shared/utils';
import Input from '@base/Input';
import {
  ControlProps,
  IFormBuilderProps,
  ISelectControlProps,
  ISelectOptionControlProps,
} from './FormBuilder.types';
import './FormBuilder.scss';
import { Select, Option } from '@base/Select';

function FormBuilder<FormData>(props: IFormBuilderProps<FormData>) {
  const {
    initialData,
    validationSchema,
    onSubmit,
    onChange,
    onBlurValidate,
    controls,
    containerClassName,
  } = props;

  const renderInputControl = ({ controlType, ...control }: ControlProps) => {
    return <Field as={Input} {...control} />;
  };
  const renderSelectControl = ({
    options,
    controlType,
    ...control
  }: ISelectControlProps) => {
    return (
      <Field as="select" component={Select} {...control}>
        {options.map((option: ISelectOptionControlProps, key: number) => (
          <Option key={`${option.label}_${key}`} {...option}></Option>
        ))}
      </Field>
    );
  };

  const renderControlByType = (control: ControlProps) => {
    if (control.controlType === 'input') return renderInputControl(control);
    if (control.controlType === 'select') return renderSelectControl(control);
  };

  const renderSection = (control: ControlProps, key: number, errors: any) => {
    return (
      <div key={`${control.name}`} className="Section">
        <label htmlFor={control.name}>
          {control.label}
          {control.required ? ' * ' : ''}:
        </label>
        {renderControlByType(control)}
        <span className="error-msg">{errors[control.name]}</span>
      </div>
    );
  };

  const handleChangeForm = (values: FormData, isValid: boolean) => {
    onChange(values, isValid);
  };

  const handleSubmitForm = (values: FormData) => {
    onSubmit(values);
  };

  return (
    <div className="FormBuilderContainer">
      <Formik
        validateOnBlur
        validateOnChange
        initialValues={initialData}
        validationSchema={validationSchema}
        onSubmit={handleSubmitForm}
      >
        {({ isValid, values, errors }) => (
          <Form
            onBlur={() => onBlurValidate(isValid)}
            onChange={() =>
              setTimeout(() => handleChangeForm(values, isValid), 300)
            }
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

export default FormBuilder;
