import { Field, Form, Formik } from 'formik';
import { classMap } from '@shared/utils';
import Input from '@base/Input';
import FieldErrorMessage from '@base/FieldErrorMessage';
import { IControlProps, IFormBuilderProps } from './FormBuilder.types';
import './FormBuilder.scss';

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

  const renderSection = (control: IControlProps, key: number) => {
    return (
      <div key={`${control.name}_${key}`} className="Section">
        <label htmlFor={control.name}>
          {control.label}
          {control.required ? ' * ' : ''}:
        </label>
        <Field as={Input} {...control} />
        <FieldErrorMessage name={control.name} />
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
    <Formik
      validateOnBlur
      validateOnChange
      initialValues={initialData}
      validationSchema={validationSchema}
      onSubmit={handleSubmitForm}
    >
      {({ isValid, values }) => (
        <Form
          onBlur={() => onBlurValidate(isValid)}
          onChange={() =>
            setTimeout(() => handleChangeForm(values, isValid), 300)
          }
          className={classMap({ [containerClassName]: !!containerClassName })}
        >
          {controls.map((control, key) => renderSection(control, key))}
        </Form>
      )}
    </Formik>
  );
}

export default FormBuilder;
