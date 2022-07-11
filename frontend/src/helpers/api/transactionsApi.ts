import { axiosAuthInstance } from '@api';

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

  return {
    createTransaction,
    editTransaction,
    deleteTransaction,
    deleteTransactions,
    getTransactions,
  };
};
