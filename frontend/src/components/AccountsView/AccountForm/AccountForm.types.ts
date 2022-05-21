import { CreateAccountRequest, EditAccountRequest } from '@shared/interfaces';

export type AccountFormData = CreateAccountRequest | EditAccountRequest;

export interface IAccountFormProps {
  type: 'create' | 'edit';
  data?: EditAccountRequest;
  onSubmitForm: (values: AccountFormData) => void;
  validateForm: (valid: boolean) => void;
}
