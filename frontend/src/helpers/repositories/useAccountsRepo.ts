import { toast } from 'react-toastify';
import {
  AccountSummaryData,
  CreateAccountRequest,
  EditAccountRequest,
  IAccount,
} from '@interfaces';
import { AxiosResponse } from 'axios';
import { setErrorToState, repoWrapper } from './utils';
import { useAccountsObservable } from '@observables';
import { useAccountsApi } from '@api';

export const useAccountsRepository = () => {
  const accountsApi = useAccountsApi();
  const accountsObservable = useAccountsObservable();

  const createAccount = (data: CreateAccountRequest) => {
    return repoWrapper(accountsObservable, () =>
      accountsApi
        .createAccount<CreateAccountRequest>(data)
        .then(() => {
          toast.success(`Account ${data.name} was created successfully`);
          accountsObservable.setUpToDateState(false);
        })
        .catch((err) => setErrorToState(err, accountsObservable)),
    );
  };

  const editAccount = (data: EditAccountRequest, accountId: string) => {
    return repoWrapper(accountsObservable, () =>
      accountsApi
        .editAccount<EditAccountRequest>(data, accountId)
        .then(() => {
          toast.success(`Account ${data.name} was edited successfully`);
          accountsObservable.setUpToDateState(false);
        })
        .catch((err) => setErrorToState(err, accountsObservable)),
    );
  };

  const deleteAccount = (accountId: string) => {
    return repoWrapper(accountsObservable, () =>
      accountsApi
        .deleteAccount(accountId)
        .then(() => {
          toast.success(`Account was deleted successfully`);
          accountsObservable.setUpToDateState(false);
        })
        .catch((err) => setErrorToState(err, accountsObservable)),
    );
  };

  const getAccounts = () => {
    return repoWrapper(accountsObservable, () =>
      accountsApi
        .getAccounts()
        .then(({ data }: AxiosResponse<IAccount[]>) => {
          accountsObservable.updateAccountData(data);
          accountsObservable.setUpToDateState(true);
        })
        .catch((err) => setErrorToState(err, accountsObservable)),
    );
  };

  const getAccountSummary = (accountId: string) => {
    return repoWrapper(accountsObservable, () =>
      accountsApi
        .getAccountSummary(accountId)
        .then(({ data }: AxiosResponse<AccountSummaryData>) => {
          return data;
        })
        .catch((err) => setErrorToState(err, accountsObservable)),
    );
  };

  const getAccountsObservable = () => accountsObservable.getObservable();

  return {
    createAccount,
    editAccount,
    deleteAccount,
    getAccounts,
    getAccountSummary,
    getAccountsObservable,
  };
};
