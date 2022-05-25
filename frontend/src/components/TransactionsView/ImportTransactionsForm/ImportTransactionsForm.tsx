import {
  ImportTransactionsFormData,
  IImportTransactionsFormProps,
} from './ImportTransactionsForm.types';

import FormBuilder from '@base/FormBuilder';
import {
  ControlProps,
  FormBuilderRef,
} from '@base/FormBuilder/FormBuilder.types';
import { createRef, forwardRef, useImperativeHandle } from 'react';
import {
  controls,
  defaultData,
  ImportTransactionsSchema,
} from './ImportTransactionsFormConfigurations';

const ImportTransactionsForm = forwardRef(function ImportTransactionsForm(
  props: IImportTransactionsFormProps,
  ref,
) {
  const { validateForm, availableAccounts, onSubmitForm } = props;

  const formBuilderRef = createRef<FormBuilderRef>();

  useImperativeHandle(ref, () => ({
    submitForm: () => formBuilderRef?.current?.submitForm(),
  }));

  const getFormProps = (): [
    ImportTransactionsFormData,
    ControlProps[],
    unknown,
  ] => {
    const processedControls = controls.map((control) => {
      if (control.name === 'accountID' && control.controlType === 'select') {
        const accounts = availableAccounts ?? [];
        control.options = accounts;
        defaultData.accountID = accounts[0].value;
      }
      return control;
    });
    return [defaultData, processedControls, ImportTransactionsSchema];
  };

  const [initialData, formControls, validationSchema] = getFormProps();
  return (
    <div className="ImportTransactionsFormContainer">
      <FormBuilder<ImportTransactionsFormData>
        ref={formBuilderRef}
        containerClassName="ImportTransactionsForm"
        initialData={initialData}
        validationSchema={validationSchema}
        controls={formControls}
        onSubmit={onSubmitForm}
        onBlurValidate={(isValid) => validateForm(isValid)}
      />
    </div>
  );
});

export default ImportTransactionsForm;
