import { ControlProps } from '@base/FormBuilder';
import * as Yup from 'yup';
import { ForecastFormData } from './ForecastForm.types';

export const SUPPORTED_FORECAST_PERIODS = ['1M', '2M', '3M'] as const;
const ForecastOptionsShape = {
  period: Yup.mixed()
    .oneOf(SUPPORTED_FORECAST_PERIODS as unknown as any[])
    .required('Required'),
  forecastType: Yup.mixed()
    .oneOf(['income', 'expenses'])
    .required('Required')
};

export const ForecastOptionsSchema = Yup.object().shape(ForecastOptionsShape);

export const controls: ControlProps[] = [
  {
    controlType: 'select',
    name: 'period',
    label: 'Forecast horizon (period)',
    value: '1M',
    description: `Choose forecast horizon`,
    required: true,
    options: [
      {
        value: '1M',
        label: '1 Month',
      },
      {
        value: '2M',
        label: '2 Months',
      },
      {
        value: '3M',
        label: '3 Months',
      },
    ],
  },
  {
    controlType: 'select',
    name: 'forecastType',
    label: 'Forecast type',
    value: 'expenses',
    description: `Choose forecast type`,
    required: true,
    options: [
      {
        value: 'income',
        label: 'Income',
      },
      {
        value: 'expenses',
        label: 'Expenses',
      },
    ],
  },
  {
    controlType: 'datepicker',
    name: 'startTime',
    description: 'Select the date from which you want to generate forecasting',
    label: 'Forecast start time',
  },
];

export const defaultData: ForecastFormData = {
  period: '1M',
  forecastType: 'expenses',
  startTime: ''
};
