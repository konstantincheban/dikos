import { ControlProps } from '@base/FormBuilder';
import * as Yup from 'yup';
import { ImportTransactionsFormData } from './ImportTransactionsForm.types';
import { SUPPORTED_IMPORT_FILE_EXTS } from '@shared/constants';

const FILE_SIZE_LIMIT = 500; // in KB

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
      message: `Please provide a supported file type - ${SUPPORTED_IMPORT_FILE_EXTS.map(ext => `fileName.${ext}`).join(', ')}`,
      test: (file, context) => {
        const isValid = SUPPORTED_IMPORT_FILE_EXTS.includes(getExtension(file?.name));
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
    description: `* Products as Transactions - each product in your receipt will be migrated to transactions
      * Check as Transaction - all of yours products will be migrated to one transaction without details
    `,
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
    controlType: 'datepicker',
    name: 'date',
    description: 'Select the date of purchase',
    label: 'Date',
  },
  {
    controlType: 'file',
    dragDropMode: true,
    type: 'file',
    required: true,
    accept: SUPPORTED_IMPORT_FILE_EXTS.join(','),
    name: 'file',
    label: 'File with transactions',
    description:
      'Select your exported receipt in .xls format from Metro account or your csv file from Monobank',
  },
];

export const defaultData: ImportTransactionsFormData = {
  accountID: '',
  aggregationType: 'productsAsTransactions',
  date: new Date().toISOString(),
  file: new File([new Blob()], 'text.txt'),
};
