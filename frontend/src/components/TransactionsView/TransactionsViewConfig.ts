import { ICategoryItem } from '@base/TagEditor/TagEditor.types';

export const filterConfig: ICategoryItem[] = [
  {
    label: 'Attributes',
    attributes: [
      {
        value: 'name',
        label: 'Name',
      },
      {
        value: 'description',
        label: 'Description',
      },
      {
        value: 'currency',
        label: 'Currency',
      },
      {
        value: 'category',
        label: 'Category',
      },
      {
        value: 'paymaster',
        label: 'Paymaster',
      },
    ],
  },
];

export const columnsConfig = [
  {
    name: 'category',
    label: 'Category',
  },
  {
    name: 'name_description',
    label: 'Name & Description',
  },
  {
    name: 'amount_currency',
    label: 'Amount & Currency',
    sortable: true,
  },
  {
    name: 'accountName',
    label: 'Associated Account',
  },
  {
    name: 'date',
    label: 'Date',
    sortable: true,
  },
  {
    name: 'paymaster',
    label: 'Paymaster',
  },
  {
    name: 'actions',
    label: 'Actions',
  },
];
