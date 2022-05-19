import { CreateAccountRequest } from '@shared/interfaces';

export interface IAccountFormProps {
  type: 'create' | 'edit';
  data?: CreateAccountRequest;
  onSubmitForm: (values: CreateAccountRequest) => void;
  validateForm: (valid: boolean) => void;
}
