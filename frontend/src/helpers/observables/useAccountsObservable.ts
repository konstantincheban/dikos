import { IAccount } from '@interfaces';
import { useObservableBaseActions, createSubject } from './utils';

export interface AccountsState {
  accounts: IAccount[];
  isUpToDate: boolean;
}

const initialState = {
  accounts: [],
  isUpToDate: false
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

  const setUpToDateState = (state: boolean) => {
    actions.setNextState({ isUpToDate: state });
  };

  return {
    ...actions,
    updateAccountData,
    setUpToDateState
  };
};
