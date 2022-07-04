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
  editFields,
  TransactionCreateSchema,
  TransactionEditSchema,
} from './TransactionFormConfigurations';

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
      // process controls
      const editFormControls = controls.reduce((acc, control) => {
        if (editFields.includes(control.name)) acc.push(control);
        if (control.name === 'transactionType' && control.controlType === 'switcher') {
          control.value = data.amount < 0 ? 'outcome' : 'income';
          data.amount = Math.abs(data.amount);
        }

        return acc;
      }, [] as ControlProps[]);

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
