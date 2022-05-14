import axios from 'axios';

const BASE_API_URL = process.env.BASE_API_URL;

export const useTransactionsApi = () => {
  const createTransaction = <RequestType>(data: RequestType) => {
    return axios.post(`${BASE_API_URL}/transactions/create`, data);
  };

  const editTransaction = <RequestType>(
    data: RequestType,
    transactionId: string,
  ) => {
    return axios.post(
      `${BASE_API_URL}/transactions/edit/${transactionId}`,
      data,
    );
  };

  const getTransactions = () => {
    return axios.get(`${BASE_API_URL}/transactions`);
  };

  return {
    createTransaction,
    editTransaction,
    getTransactions,
  };
};
