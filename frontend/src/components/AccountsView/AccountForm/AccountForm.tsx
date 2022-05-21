import { AccountFormData, IAccountFormProps } from './AccountForm.types';

import FormBuilder from '@base/FormBuilder';
import { EditAccountRequest } from '@shared/interfaces';
import { ControlProps } from '@base/FormBuilder/FormBuilder.types';
import { forwardRef, useImperativeHandle, useState } from 'react';
import {
  AccountCreateSchema,
  AccountEditSchema,
  controls,
  defaultData,
  editFields,
} from './AccountFormConfigurations';
import './AccountForm.scss';

const AccountForm = forwardRef(function AccountForm(
  props: IAccountFormProps,
  ref,
) {
  const { data, type, validateForm, onSubmitForm } = props;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [formData, setFormData] = useState<AccountFormData>(defaultData);

  useImperativeHandle(ref, () => ({
    getFormData() {
      return formData;
    },
  }));

  const getFormProps = (
    type: 'create' | 'edit',
  ): [AccountFormData, ControlProps[], unknown] => {
    if (type === 'edit') {
      const editFormControls = controls.filter((control) =>
        editFields.includes(control.name),
      );
      const defaultFormData: EditAccountRequest = {
        name: '',
        description: '',
      };
      editFields.forEach((fieldName) => {
        defaultFormData[fieldName as keyof EditAccountRequest] =
          defaultData[fieldName as keyof EditAccountRequest];
      });
      return [data ?? defaultData, editFormControls, AccountEditSchema];
    }

    return [defaultData, controls, AccountCreateSchema];
  };

  const handleOnChange = (values: AccountFormData, isValid: boolean) => {
    setFormData(values);
    validateForm(isValid);
  };

  const [initialData, formControls, validationSchema] = getFormProps(type);
  return (
    <div className="AccountFormContainer">
      <FormBuilder<AccountFormData>
        containerClassName="AccountForm"
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

export default AccountForm;
