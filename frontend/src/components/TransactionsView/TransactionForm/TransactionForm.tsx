import {
  TransactionFormData,
  ITransactionFormProps,
} from './TransactionForm.types';

import FormBuilder from '@base/FormBuilder';
import { ControlProps } from '@base/FormBuilder/FormBuilder.types';
import { forwardRef, useImperativeHandle, useState } from 'react';
import {
  controls,
  defaultData,
  editFields,
  TransactionCreateSchema,
  TransactionEditSchema,
} from './TransactionFormConfigurations';
import './TransactionForm.scss';
import { EditTransactionRequest } from '@shared/interfaces';

const TransactionForm = forwardRef(function TransactionForm(
  props: ITransactionFormProps,
  ref,
) {
  const { data, type, validateForm, availableAccounts, onSubmitForm } = props;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [formData, setFormData] = useState<TransactionFormData>(defaultData);

  useImperativeHandle(ref, () => ({
    getFormData() {
      return formData;
    },
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

  const handleOnChange = (values: TransactionFormData, isValid: boolean) => {
    setFormData(values);
    validateForm(isValid);
  };

  const [initialData, formControls, validationSchema] = getFormProps();
  return (
    <div className="TransactionFormContainer">
      <FormBuilder<TransactionFormData>
        containerClassName="TransactionForm"
        initialData={initialData}
        validationSchema={validationSchema}
        controls={formControls}
        onSubmit={onSubmitForm}
        onChange={handleOnChange}
        onBlurValidate={(isValid) => validateForm(isValid)}
      />
    </div>
  );
});

export default TransactionForm;
