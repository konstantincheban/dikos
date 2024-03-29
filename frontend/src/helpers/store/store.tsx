/* eslint-disable react-hooks/rules-of-hooks */
import React, { createContext, useContext } from 'react';
import {
  useAuthObservable,
  useAccountsObservable,
  useTransactionsObservable,
  useUsersObservable,
  useStatisticsObservable,
  useAnalyticsObservable
} from '@observables';

const authState$ = useAuthObservable().getObservable();
const accountsState$ = useAccountsObservable().getObservable();
const transactionsState$ = useTransactionsObservable().getObservable();
const userState$ = useUsersObservable().getObservable();
const statisticsState$ = useStatisticsObservable().getObservable();
const analyticsState$ = useAnalyticsObservable().getObservable();

const StoreContext = createContext({
  authState$,
  accountsState$,
  transactionsState$,
  userState$,
  statisticsState$,
  analyticsState$
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
      statisticsState$,
      analyticsState$
    }}
  >
    {children}
  </StoreContext.Provider>
);
