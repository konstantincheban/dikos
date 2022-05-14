import { IAccount } from '@interfaces';
import { toast } from 'react-toastify';
import { createSubject, IState } from './utils';

export interface AccountsState {
  accounts: IAccount[];
}

const initialState = {
  accounts: [],
  loading: false,
  error: '',
};

const accountsSubject$ = createSubject<IState<AccountsState>>(initialState);

export const useAccountsObservable = () => {
  const updateAccountData = (accountsData: IAccount[]) => {
    setNextState({
      accounts: [...accountsData],
    });
  };

  const setError = (message: string) => {
    toast.error(message);
    setNextState({ error: message });
  };

  const setLoadingState = (state: boolean) => {
    setNextState({ loading: state });
  };

  const setNextState = (payload: Partial<IState<AccountsState>>) => {
    const state = accountsSubject$.getValue();
    accountsSubject$.next({ ...state, ...payload });
  };

  const getObservable = () => {
    return accountsSubject$;
  };

  return {
    updateAccountData,
    setError,
    setLoadingState,
    getObservable,
  };
};