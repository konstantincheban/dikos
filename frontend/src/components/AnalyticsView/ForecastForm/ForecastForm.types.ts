import { ForecastOptions } from '@interfaces';

export type ForecastFormData = ForecastOptions;

export interface IForecastFormProps {
  latestTransactionDate: string;
  onSubmitForm: (values: ForecastFormData) => void;
  validateForm: (valid: boolean) => void;
}
