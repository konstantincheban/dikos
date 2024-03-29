import { ControlProps } from '@base/FormBuilder';
import { validCurrencies } from '@components/AccountsView/AccountForm/AccountFormConfigurations';
import moment from 'moment';
import * as Yup from 'yup';

const EditShape = {
  name: Yup.string()
    .min(3, 'Transaction name too short')
    .max(40, 'Transaction name too large'),
  description: Yup.string().max(100, 'Description is too long'),
  amount: Yup.number().required('Required'),
  category: Yup.string().max(30, 'Category name is too long'),
  date: Yup.date(),
  paymaster: Yup.string().max(30, 'Paymaster name is too long'),
};

const CreateShape = {
  ...EditShape,
  accountID: Yup.string().required('Required'),
  currency: Yup.mixed()
    .oneOf(
      validCurrencies,
      `Provide valid currency value - ${validCurrencies.join(', ')}`,
    )
    .required('Required'),
};

export const TransactionCreateSchema = Yup.object().shape(CreateShape);
export const TransactionEditSchema = Yup.object().shape(EditShape);

export const controls: ControlProps[] = [
  {
    controlType: 'select',
    name: 'accountID',
    label: 'Associated Account',
    required: true,
    options: [],
  },
  {
    controlType: 'input',
    name: 'name',
    label: 'Name',
  },
  {
    controlType: 'input',
    name: 'description',
    label: 'Description',
  },
  {
    controlType: 'switcher',
    name: 'transactionType',
    label: 'Transaction Type',
    value: 'income',
    options: [
      { value: 'income', label: 'Income' },
      { value: 'expenses', label: 'Expenses' }
    ]
  },
  {
    controlType: 'input',
    type: 'number',
    name: 'amount',
    label: 'Amount',
    required: true,
    min: 0
  },
  {
    controlType: 'select',
    name: 'currency',
    label: 'Currency',
    value: 'UAH',
    required: true,
    readOnly: true,
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
    controlType: 'tagEditor',
    name: 'category',
    label: 'Category',
    placeholder: 'Select your transaction category',
    categories: [{
      label: 'Categories',
      attributes: []
    }]
  },
  {
    controlType: 'datepicker',
    name: 'date',
    label: 'Date',
  },
  {
    controlType: 'input',
    description: 'Shop/Place where you made the transaction',
    name: 'paymaster',
    label: 'Paymaster',
  },
];

export const editFields = [
  'name',
  'description',
  'transactionType',
  'amount',
  'category',
  'date',
  'paymaster',
];
export const defaultData = {
  accountID: '',
  name: '',
  description: '',
  transactionType: 'income',
  amount: 0,
  currency: 'UAH',
  category: '',
  date: moment().toISOString(),
  paymaster: '',
};