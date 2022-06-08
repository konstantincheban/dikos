import { ImportTransactions } from '@interfaces';
import { SelectOptionControlProps } from '@base/FormBuilder';

export type ImportTransactionsFormData = ImportTransactions;

export interface IImportTransactionsFormProps {
  availableAccounts?: SelectOptionControlProps[];
  onSubmitForm: (values: ImportTransactionsFormData) => void;
  validateForm: (valid: boolean) => void;
}
