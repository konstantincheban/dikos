import { ISelectOptionControlProps } from '@base/FormBuilder';
import { CreateTransactionRequest } from '@shared/interfaces';

export type TransactionFormData = CreateTransactionRequest;

export interface ITransactionFormProps {
  availableAccounts: ISelectOptionControlProps[];
  data: TransactionFormData;
  onSubmitForm: (values: TransactionFormData) => void;
  validateForm: (valid: boolean) => void;
}
