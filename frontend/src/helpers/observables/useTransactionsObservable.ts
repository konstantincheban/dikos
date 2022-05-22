import { toast } from 'react-toastify';
import { createSubject, IState } from './utils';

export type TransactionsState = {
  isUpToDate: boolean;
};

const initialState = {
  isUpToDate: false,
  loading: false,
  error: '',
};

const transactionsSubject$ =
  createSubject<IState<TransactionsState>>(initialState);

export const useTransactionsObservable = () => {
  const setUpToDateState = (state: boolean) => {
    setNextState({ isUpToDate: state });
  };

  const setError = (message: string) => {
    toast.error(message);
    setNextState({ error: message });
  };

  const setLoadingState = (state: boolean) => {
    setNextState({ loading: state });
  };

  const setNextState = (payload: Partial<IState<TransactionsState>>) => {
    const state = transactionsSubject$.getValue();
    transactionsSubject$.next({ ...state, ...payload });
  };

  const getObservable = () => {
    return transactionsSubject$;
  };

  return {
    setError,
    setLoadingState,
    setUpToDateState,
    getObservable,
  };
};
