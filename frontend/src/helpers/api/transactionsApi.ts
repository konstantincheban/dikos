import { axiosAuthInstance } from '@api';

export const useTransactionsApi = () => {
  const createTransaction = <RequestType>(data: RequestType) => {
    return axiosAuthInstance.post('/transactions/create', data);
  };

  const editTransaction = <RequestType>(
    data: RequestType,
    transactionId: string,
  ) => {
    return axiosAuthInstance.post(`/transactions/edit/${transactionId}`, data);
  };

  const getTransactions = () => {
    return axiosAuthInstance.get('/transactions');
  };

  return {
    createTransaction,
    editTransaction,
    getTransactions,
  };
};
