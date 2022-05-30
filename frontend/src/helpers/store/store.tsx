/* eslint-disable react-hooks/rules-of-hooks */
import React, { createContext, useContext } from 'react';
import {
  useAuthObservable,
  useAccountsObservable,
  useTransactionsObservable,
  useUsersObservable,
} from '@observables';

const authState$ = useAuthObservable().getObservable();
const accountsState$ = useAccountsObservable().getObservable();
const transactionsState$ = useTransactionsObservable().getObservable();
const userState$ = useUsersObservable().getObservable();

const StoreContext = createContext({
  authState$,
  accountsState$,
  transactionsState$,
  userState$,
});

export const useStore = () => useContext(StoreContext);

export const StoreProvider = ({
  children,
}: React.PropsWithChildren<unknown>) => (
  <StoreContext.Provider
    value={{
      authState$,
      accountsState$,
      transactionsState$,
      userState$,
    }}
  >
    {children}
  </StoreContext.Provider>
);
