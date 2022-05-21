import { ControlProps } from '@base/FormBuilder';
import * as Yup from 'yup';

const validCurrencies = ['UAH', 'USD', 'EUR'];

const EditShape = {
  name: Yup.string()
    .min(3, 'Account name too short')
    .max(20, 'Account name too large')
    .required('Required'),
  description: Yup.string().max(100, 'Description is too long'),
};

const CreateShape = {
  ...EditShape,
  currency: Yup.mixed()
    .oneOf(
      validCurrencies,
      `Provide valid currency value - ${validCurrencies.join(', ')}`,
    )
    .required('Required'),
  type: Yup.mixed().oneOf(['custom']).required('Required'),
};

export const AccountCreateSchema = Yup.object().shape(CreateShape);
export const AccountEditSchema = Yup.object().shape(EditShape);

export const controls: ControlProps[] = [
  {
    type: 'input',
    name: 'name',
    label: 'Name',
    required: true,
  },
  {
    type: 'input',
    name: 'description',
    label: 'Description',
  },
  {
    type: 'select',
    name: 'currency',
    label: 'Currency',
    value: 'UAH',
    required: true,
    options: [
      {
        value: 'UAH',
        label: 'UAH',
      },
      {
        value: 'USD',
        label: 'USD',
      },
      {
        value: 'EUR',
        label: 'EUR',
      },
    ],
  },
  {
    type: 'select',
    name: 'type',
    label: 'Type',
    value: 'custom',
    readOnly: true,
    required: true,
    options: [
      {
        value: 'custom',
        label: 'Custom',
      },
    ],
  },
];

export const editFields = ['name', 'description'];
export const defaultData = {
  name: '',
  description: '',
  currency: 'UAH',
  type: 'custom',
};
