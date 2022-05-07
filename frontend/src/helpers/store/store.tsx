/* eslint-disable react-hooks/rules-of-hooks */
import React, { createContext, useContext } from 'react';
import { useAuthObservable } from '@observables';

const authState$ = useAuthObservable().getObservable();

const StoreContext = createContext({
  authState$,
});

export const useStore = () => useContext(StoreContext);

export const StoreProvider = ({
  children,
}: React.PropsWithChildren<unknown>) => (
  <StoreContext.Provider
    value={{
      authState$,
    }}
  >
    {children}
  </StoreContext.Provider>
);
