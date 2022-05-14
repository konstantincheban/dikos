import { setErrorToState } from './utils';
import { useTransactionsObservable } from '../observables';
import { useTransactionsApi } from '@api';
import {
  CreateTransactionRequest,
  EditTransactionRequest,
  ITransaction,
} from '@shared/interfaces';
import { AxiosResponse } from 'axios';

export const useTransactionsRepository = () => {
  const transactionsApi = useTransactionsApi();
  const transactionsObservable = useTransactionsObservable();

  const createTransaction = async (data: CreateTransactionRequest) => {
    transactionsObservable.setLoadingState(true);
    transactionsApi
      .createTransaction<CreateTransactionRequest>(data)
      .then(() => {
        transactionsObservable.setLoadingState(false);
      })
      .catch((err) => setErrorToState(err, transactionsObservable));
  };

  const editTransaction = async (
    data: EditTransactionRequest,
    transactionId: string,
  ) => {
    transactionsObservable.setLoadingState(true);
    transactionsApi
      .editTransaction<EditTransactionRequest>(data, transactionId)
      .then(() => {
        transactionsObservable.setLoadingState(false);
      })
      .catch((err) => setErrorToState(err, transactionsObservable));
  };

  const deleteTransaction = async () => {
    // TODO
  };

  const getTransactions = () => {
    transactionsObservable.setLoadingState(true);
    return transactionsApi
      .getTransactions()
      .then(({ data }: AxiosResponse<ITransaction[]>) => {
        transactionsObservable.setLoadingState(false);
        return data;
      })
      .catch((err) => setErrorToState(err, transactionsObservable));
  };

  const getTransactionsObservable = () =>
    transactionsObservable.getObservable();

  return {
    createTransaction,
    editTransaction,
    getTransactions,
    getTransactionsObservable,
  };
};
