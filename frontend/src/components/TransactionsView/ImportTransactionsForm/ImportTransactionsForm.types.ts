import { ImportTransactions } from '@interfaces';
import { ISelectOptionControlProps } from '@base/FormBuilder';

export type ImportTransactionsFormData = ImportTransactions;

export interface IImportTransactionsFormProps {
  availableAccounts?: ISelectOptionControlProps[];
  onSubmitForm: (values: ImportTransactionsFormData) => void;
  validateForm: (valid: boolean) => void;
}
