import { AxiosResponse } from 'axios';
import { setErrorToState } from './utils';
import { useAccountsObservable } from '../observables';
import { useAccountsApi } from '@api';
import {
  CreateAccountRequest,
  EditAccountRequest,
  IAccount,
} from '@shared/interfaces';

export const useAccountsRepository = () => {
  const accountsApi = useAccountsApi();
  const accountsObservable = useAccountsObservable();

  const createAccount = async (data: CreateAccountRequest) => {
    accountsObservable.setLoadingState(true);
    await accountsApi
      .createAccount<CreateAccountRequest>(data)
      .then(() => {
        getAccounts();
      })
      .catch((err) => setErrorToState(err, accountsObservable));

    accountsObservable.setLoadingState(false);
  };

  const editAccount = async (data: EditAccountRequest, accountId: string) => {
    accountsObservable.setLoadingState(true);
    await accountsApi
      .editAccount<EditAccountRequest>(data, accountId)
      .then(() => {
        getAccounts();
      })
      .catch((err) => setErrorToState(err, accountsObservable));
    accountsObservable.setLoadingState(false);
  };

  const deleteAccount = async (accountId: string) => {
    accountsObservable.setLoadingState(true);
    await accountsApi
      .deleteAccount(accountId)
      .then(() => {
        getAccounts();
      })
      .catch((err) => setErrorToState(err, accountsObservable));
    accountsObservable.setLoadingState(false);
  };

  const getAccounts = async () => {
    accountsObservable.setLoadingState(true);
    await accountsApi
      .getAccounts()
      .then(({ data }: AxiosResponse<IAccount[]>) => {
        accountsObservable.updateAccountData(data);
      })
      .catch((err) => setErrorToState(err, accountsObservable));

    accountsObservable.setLoadingState(false);
  };

  const getAccountsObservable = () => accountsObservable.getObservable();

  return {
    createAccount,
    editAccount,
    deleteAccount,
    getAccounts,
    getAccountsObservable,
  };
};
