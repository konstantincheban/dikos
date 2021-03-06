import { repoWrapper, setErrorToState } from './utils';
import { useAccountsObservable, useTransactionsObservable } from '@observables';
import { useTransactionsApi, useImportApi } from '@api';
import {
  CreateTransactionRequest,
  DeleteTransactionsRequest,
  DeleteTransactionsResponse,
  EditTransactionRequest,
  ITransaction,
} from '@interfaces';
import { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { AttributeItem } from '@base/TagEditor';

export const useTransactionsRepository = () => {
  const transactionsApi = useTransactionsApi();
  const importApi = useImportApi();
  const transactionsObservable = useTransactionsObservable();
  const accountsObservable = useAccountsObservable();

  const createTransaction = (data: CreateTransactionRequest) => {
    return repoWrapper(transactionsObservable, () =>
      transactionsApi
        .createTransaction<CreateTransactionRequest>(data)
        .then(() => {
          toast.success(`Transaction ${data.name} was created successfully`);
          transactionsObservable.setUpToDateState(false);
          accountsObservable.setUpToDateState(false);
        })
        .catch((err) => setErrorToState(err, transactionsObservable)),
    );
  };

  const importTransactions = (data: FormData) => {
    return repoWrapper(transactionsObservable, () =>
      importApi.importMetroTransactions<FormData>(data).then(() => {
        transactionsObservable.setUpToDateState(false);
        accountsObservable.setUpToDateState(false);
      }),
    );
  };

  const editTransaction = (
    data: EditTransactionRequest,
    transactionId: string,
  ) => {
    return repoWrapper(transactionsObservable, () =>
      transactionsApi
        .editTransaction<EditTransactionRequest>(data, transactionId)
        .then(() => {
          toast.success(`Transaction ${data.name} was edited successfully`);
          transactionsObservable.setUpToDateState(false);
          accountsObservable.setUpToDateState(false);
        })
        .catch((err) => setErrorToState(err, transactionsObservable)),
    );
  };

  const deleteTransaction = (transactionId: string) => {
    return repoWrapper(transactionsObservable, () =>
      transactionsApi
        .deleteTransaction(transactionId)
        .then(() => {
          toast.success(`Transaction was deleted successfully`);
          transactionsObservable.setUpToDateState(false);
          accountsObservable.setUpToDateState(false);
        })
        .catch((err) => setErrorToState(err, transactionsObservable)),
    );
  };

  const deleteTransactions = (transactionIds: string[]) => {
    return repoWrapper(transactionsObservable, () =>
      transactionsApi
        .deleteTransactions<DeleteTransactionsRequest>({ entries: transactionIds })
        .then(({ data: statuses }: AxiosResponse<DeleteTransactionsResponse>) => {
          transactionsObservable.setUpToDateState(false);
          accountsObservable.setUpToDateState(false);
          // @TODO: implement details modal and details options in the toaster
          console.table(statuses);
          const { countOfSuccessful, countOfFailed } = statuses.reduce((acc, item) => {
            if (item.status === 'success') acc.countOfSuccessful += 1;
            if (item.status === 'failed') acc.countOfFailed += 1;
            return acc;
          }, { countOfSuccessful: 0, countOfFailed: 0 })

          countOfSuccessful && toast.success(`${countOfSuccessful} transactions were deleted successfully`);
          countOfFailed && toast.error(`${countOfFailed} transactions have not been deleted`);
        })
        .catch((err) => setErrorToState(err, transactionsObservable)),
    );
  };

  const getTransactions = (queryParams?: string) => {
    return repoWrapper(transactionsObservable, () =>
      transactionsApi
        .getTransactions(queryParams)
        .then(({ data }: AxiosResponse<ITransaction[]>) => {
          transactionsObservable.setUpToDateState(true);
          return data;
        })
        .catch((err) => setErrorToState(err, transactionsObservable)),
    );
  };

  const getProposedCategories = () => {
    repoWrapper(transactionsObservable, () =>
      transactionsApi
        .getProposedCategories()
        .then(({ data }: AxiosResponse<AttributeItem[]>) => {
          transactionsObservable.setProposedCategories(data);
        })
        .catch((err) => setErrorToState(err, transactionsObservable)),
    );
  };

  const getTransactionsObservable = () =>
    transactionsObservable.getObservable();

  return {
    createTransaction,
    editTransaction,
    deleteTransaction,
    deleteTransactions,
    getTransactions,
    importTransactions,
    getProposedCategories,
    getTransactionsObservable,
  };
};
