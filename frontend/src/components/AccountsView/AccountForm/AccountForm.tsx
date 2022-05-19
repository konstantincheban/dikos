import { IAccountFormProps } from './AccountForm.types';

import FormBuilder from '@base/FormBuilder';
import { CreateAccountRequest } from '@shared/interfaces';
import { IControlProps } from '@base/FormBuilder/FormBuilder.types';
import './AccountForm.scss';
import { forwardRef, useImperativeHandle, useState } from 'react';
import {
  AccountCreateSchema,
  AccountEditSchema,
  controls,
  defaultData,
  editFields,
} from './AccountFormConfigurations';

const AccountForm = forwardRef(function AccountForm(
  props: IAccountFormProps,
  ref,
) {
  const { data, type, validateForm, onSubmitForm } = props;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [formData, setFormData] = useState(defaultData);

  useImperativeHandle(ref, () => ({
    getFormData() {
      return formData;
    },
  }));

  const getFormProps = (
    type: 'create' | 'edit',
  ): [CreateAccountRequest, IControlProps[], unknown] => {
    if (type === 'edit') {
      const editFormControls = controls.filter((control) =>
        editFields.includes(control.name),
      );
      return [data ?? defaultData, editFormControls, AccountEditSchema];
    }

    return [defaultData, controls, AccountCreateSchema];
  };

  const handleOnChange = (values: CreateAccountRequest, isValid: boolean) => {
    setFormData(values);
    validateForm(isValid);
  };

  const [initialData, formControls, validationSchema] = getFormProps(type);
  return (
    <div className="AccountFormContainer">
      <FormBuilder<CreateAccountRequest>
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
