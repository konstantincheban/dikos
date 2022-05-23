import {
  TransactionFormData,
  ITransactionFormProps,
} from './TransactionForm.types';

import FormBuilder from '@base/FormBuilder';
import {
  ControlProps,
  FormBuilderRef,
} from '@base/FormBuilder/FormBuilder.types';
import { createRef, forwardRef, useImperativeHandle } from 'react';
import {
  controls,
  defaultData,
  editFields,
  TransactionCreateSchema,
  TransactionEditSchema,
} from './TransactionFormConfigurations';
import { EditTransactionRequest } from '@shared/interfaces';

const TransactionForm = forwardRef(function TransactionForm(
  props: ITransactionFormProps,
  ref,
) {
  const { data, type, validateForm, availableAccounts, onSubmitForm } = props;

  const formBuilderRef = createRef<FormBuilderRef>();

  useImperativeHandle(ref, () => ({
    submitForm: () => formBuilderRef?.current?.submitForm(),
  }));

  const getFormProps = (): [TransactionFormData, ControlProps[], unknown] => {
    if (type === 'edit') {
      const editFormControls = controls.filter((control) =>
        editFields.includes(control.name),
      );
      const defaultFormData: any = {};
      editFields.forEach((fieldName) => {
        defaultFormData[fieldName as keyof EditTransactionRequest] =
          defaultData[fieldName as keyof EditTransactionRequest];
      });
      return [data, editFormControls, TransactionEditSchema];
    }
    const processedControls = controls.map((control) => {
      if (control.name === 'accountID' && control.controlType === 'select')
        control.options = availableAccounts ?? [];
      return control;
    });
    return [data, processedControls, TransactionCreateSchema];
  };

  const [initialData, formControls, validationSchema] = getFormProps();
  return (
    <div className="TransactionFormContainer">
      <FormBuilder<TransactionFormData>
        ref={formBuilderRef}
        containerClassName="TransactionForm"
        initialData={initialData}
        validationSchema={validationSchema}
        controls={formControls}
        onSubmit={onSubmitForm}
        onBlurValidate={(isValid) => validateForm(isValid)}
      />
    </div>
  );
});

export default TransactionForm;
