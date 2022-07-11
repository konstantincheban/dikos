import { axiosAuthInstance } from './index';

export const useAccountsApi = () => {
  const createAccount = <RequestType>(data: RequestType) => {
    return axiosAuthInstance.post('/accounts/create', data);
  };

  const editAccount = <RequestType>(data: RequestType, accountId: string) => {
    return axiosAuthInstance.put(`/accounts/edit/${accountId}`, data);
  };

  const deleteAccount = (accountId: string) => {
    return axiosAuthInstance.delete(`/accounts/delete/${accountId}`);
  };

  const getAccounts = () => {
    return axiosAuthInstance.get('/accounts');
  };

  const getAccountSummary = (accountId: string) => {
    return axiosAuthInstance.get(`/accounts/summaryData/${accountId}`);
  };

  return {
    createAccount,
    editAccount,
    deleteAccount,
    getAccounts,
    getAccountSummary,
  };
};
