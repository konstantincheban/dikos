import { SelectOptionControlProps } from '@base/FormBuilder';
import {
  CreateTransactionRequest,
  EditTransactionRequest,
} from '@shared/interfaces';

export type TransactionFormData =
  | CreateTransactionRequest
  | EditTransactionRequest;

export interface ITransactionFormProps {
  type: 'create' | 'edit';
  availableAccounts?: SelectOptionControlProps[];
  data: TransactionFormData;
  onSubmitForm: (values: TransactionFormData) => void;
  validateForm: (valid: boolean) => void;
}
