import {
  ForecastFormData,
  IForecastFormProps,
} from './ForecastForm.types';

import FormBuilder from '@base/FormBuilder';
import {
  FormBuilderRef,
} from '@base/FormBuilder/FormBuilder.types';
import { createRef, forwardRef, useImperativeHandle } from 'react';
import {
  controls,
  defaultData,
  ForecastOptionsSchema,
} from './ForecastFormConfigurations';

const ForecastForm = forwardRef(function ForecastForm(
  props: IForecastFormProps,
  ref,
) {
  const { validateForm, onSubmitForm, latestTransactionDate } = props;

  const formBuilderRef = createRef<FormBuilderRef>();

  useImperativeHandle(ref, () => ({
    submitForm: () => formBuilderRef?.current?.submitForm(),
  }));

  return (
    <div className="ForecastFormContainer">
      <FormBuilder<ForecastFormData>
        ref={formBuilderRef}
        containerClassName="ForecastForm"
        initialData={{...defaultData, startTime: latestTransactionDate}}
        validationSchema={ForecastOptionsSchema}
        controls={controls}
        onSubmit={onSubmitForm}
        onBlurValidate={(isValid) => validateForm(isValid)}
      />
    </div>
  );
});

export default ForecastForm;
