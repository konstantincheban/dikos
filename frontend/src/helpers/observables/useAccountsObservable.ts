import { IAccount } from '@interfaces';
import { useObservableBaseActions, createSubject } from './utils';

export interface AccountsState {
  accounts: IAccount[];
}

const initialState = {
  accounts: [],
};

const accountsSubject$ = createSubject<AccountsState>(initialState);

export const useAccountsObservable = () => {
  const actions = useObservableBaseActions<AccountsState, AccountsState>(
    accountsSubject$,
  );

  const updateAccountData = (accountsData: IAccount[]) => {
    actions.setNextState({
      accounts: [...accountsData],
      error: '',
    });
  };

  return {
    ...actions,
    updateAccountData,
  };
};
