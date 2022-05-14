import axios from 'axios';

const BASE_API_URL = process.env.BASE_API_URL;

export const useAccountsApi = () => {
  const createAccount = <RequestType>(data: RequestType) => {
    return axios.post(`${BASE_API_URL}/accounts/create`, data);
  };

  const editAccount = <RequestType>(data: RequestType, accountId: string) => {
    return axios.post(`${BASE_API_URL}/accounts/edit/${accountId}`, data);
  };

  const getAccounts = () => {
    return axios.get(`${BASE_API_URL}/accounts`);
  };

  return {
    createAccount,
    editAccount,
    getAccounts,
  };
};
