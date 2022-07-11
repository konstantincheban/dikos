import { axiosAuthInstance } from '@api';
import { COUNT_OF_PROPOSED_CATEGORIES } from '@shared/constants';

export const useTransactionsApi = () => {
  const createTransaction = <RequestType>(data: RequestType) => {
    return axiosAuthInstance.post('/transactions/create', data);
  };

  const editTransaction = <RequestType>(
    data: RequestType,
    transactionId: string,
  ) => {
    return axiosAuthInstance.put(`/transactions/edit/${transactionId}`, data);
  };

  const deleteTransaction = (transactionId: string) => {
    return axiosAuthInstance.delete(`/transactions/delete/${transactionId}`);
  };

  const deleteTransactions = <RequestType>(payload: RequestType) => {
    return axiosAuthInstance.post(`/transactions/multi_delete`, payload);
  };

  const getTransactions = (queryParams?: string) => {
    return axiosAuthInstance.get(`/transactions${queryParams}`);
  };

  const getProposedCategories = () => {
    return axiosAuthInstance.get(`/transactions/proposedCategories?top=${COUNT_OF_PROPOSED_CATEGORIES}`);
  };


  return {
    createTransaction,
    editTransaction,
    deleteTransaction,
    deleteTransactions,
    getTransactions,
    getProposedCategories
  };
};
