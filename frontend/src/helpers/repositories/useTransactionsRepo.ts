import { setErrorToState } from './utils';
import { useTransactionsObservable } from '../observables';
import { useTransactionsApi, useImportApi } from '@api';
import {
  CreateTransactionRequest,
  EditTransactionRequest,
  ITransaction,
} from '@shared/interfaces';
import { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

export const useTransactionsRepository = () => {
  const transactionsApi = useTransactionsApi();
  const importApi = useImportApi();
  const transactionsObservable = useTransactionsObservable();

  const createTransaction = async (data: CreateTransactionRequest) => {
    transactionsObservable.setLoadingState(true);
    await transactionsApi
      .createTransaction<CreateTransactionRequest>(data)
      .then(() => {
        toast.success(`Transaction ${data.name} was created successfully`);
        transactionsObservable.setLoadingState(false);
        transactionsObservable.setUpToDateState(false);
      })
      .catch((err) => setErrorToState(err, transactionsObservable));
  };

  const importTransactions = async (data: FormData) => {
    transactionsObservable.setLoadingState(true);
    return importApi.importMetroTransactions<FormData>(data).then(() => {
      transactionsObservable.setLoadingState(false);
      transactionsObservable.setUpToDateState(false);
    });
  };

  const editTransaction = async (
    data: EditTransactionRequest,
    transactionId: string,
  ) => {
    transactionsObservable.setLoadingState(true);
    await transactionsApi
      .editTransaction<EditTransactionRequest>(data, transactionId)
      .then(() => {
        toast.success(`Transaction ${data.name} was edited successfully`);
        transactionsObservable.setLoadingState(false);
        transactionsObservable.setUpToDateState(false);
      })
      .catch((err) => setErrorToState(err, transactionsObservable));
  };

  const deleteTransaction = async (transactionId: string) => {
    transactionsObservable.setLoadingState(true);
    await transactionsApi
      .deleteTransaction(transactionId)
      .then(() => {
        toast.success(`Transaction was deleted successfully`);
        transactionsObservable.setLoadingState(false);
        transactionsObservable.setUpToDateState(false);
      })
      .catch((err) => setErrorToState(err, transactionsObservable));
  };

  const getTransactions = (queryParams?: string) => {
    transactionsObservable.setLoadingState(true);
    return transactionsApi
      .getTransactions(queryParams)
      .then(({ data }: AxiosResponse<ITransaction[]>) => {
        transactionsObservable.setLoadingState(false);
        transactionsObservable.setUpToDateState(true);
        return data;
      })
      .catch((err) => setErrorToState(err, transactionsObservable));
  };

  const getTransactionsObservable = () =>
    transactionsObservable.getObservable();

  return {
    createTransaction,
    editTransaction,
    deleteTransaction,
    getTransactions,
    importTransactions,
    getTransactionsObservable,
  };
};
