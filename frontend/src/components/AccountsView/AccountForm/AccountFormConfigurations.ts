import { IControlProps } from '@base/FormBuilder';
import * as Yup from 'yup';

const EditShape = {
  name: Yup.string()
    .min(3, 'Account name too short')
    .max(20, 'Account name too large')
    .required('Required'),
  description: Yup.string().max(1000, 'Description is too long'),
};

const CreateShape = {
  ...EditShape,
  currency: Yup.mixed().oneOf(['UAH', 'USD', 'EUR']).required('Required'),
  type: Yup.mixed().oneOf(['custom']).required('Required'),
};

export const AccountCreateSchema = Yup.object().shape(CreateShape);
export const AccountEditSchema = Yup.object().shape(EditShape);

export const controls: IControlProps[] = [
  {
    name: 'name',
    label: 'Name',
    required: true,
  },
  {
    name: 'description',
    label: 'Description',
  },
  {
    name: 'currency',
    label: 'Currency',
    value: 'UAH',
    readOnly: true,
    required: true,
  },
  {
    name: 'type',
    label: 'Type',
    value: 'custom',
    readOnly: true,
    required: true,
  },
];

export const editFields = ['name', 'description'];
export const defaultData = {
  name: '',
  description: '',
  currency: 'UAH',
  type: 'custom',
};
