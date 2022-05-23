import { ControlProps } from '@base/FormBuilder';
import * as Yup from 'yup';
import { ImportTransactionsFormData } from './ImportTransactionsForm.types';

const FILE_SIZE_LIMIT = 100; // in KB

const getExtension = (fileName: string | undefined) => {
  return fileName?.split('.')?.pop() ?? '';
};

const ImportShape = {
  accountID: Yup.string().required('Required'),
  aggregationType: Yup.mixed()
    .oneOf(['productsAsTransactions', 'checkAsTransaction'])
    .required('Required'),
  file: Yup.mixed()
    .test({
      message: 'Please provide a supported file type - fileName.xls',
      test: (file, context) => {
        const isValid = ['xls'].includes(getExtension(file?.name));
        if (!isValid) context?.createError();
        return isValid;
      },
    })
    .test({
      message: `File too big, can't exceed ${FILE_SIZE_LIMIT}KB`,
      test: (file) => {
        // convert bytes to KB
        const sizeInKB = file?.size / 1024;
        const isValid = sizeInKB < FILE_SIZE_LIMIT;
        return isValid;
      },
    }),
};

export const ImportTransactionsSchema = Yup.object().shape(ImportShape);

export const controls: ControlProps[] = [
  {
    controlType: 'select',
    name: 'accountID',
    label: 'Associated Account',
    required: true,
    options: [],
  },
  {
    controlType: 'select',
    name: 'aggregationType',
    label: 'Aggregation Type',
    value: 'productsAsTransactions',
    required: true,
    options: [
      {
        value: 'productsAsTransactions',
        label: 'Products as Transactions',
      },
      {
        value: 'checkAsTransaction',
        label: 'Check as Transaction',
      },
    ],
  },
  {
    controlType: 'file',
    dragDropMode: true,
    type: 'file',
    required: true,
    accept: '.xls',
    name: 'file',
    label: 'Transaction File',
  },
];

export const defaultData: ImportTransactionsFormData = {
  accountID: '',
  aggregationType: 'productsAsTransactions',
  file: new File([new Blob()], 'text.txt'),
};
