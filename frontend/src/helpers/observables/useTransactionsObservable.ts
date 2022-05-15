import { toast } from 'react-toastify';
import { createSubject, IState } from './utils';

const initialState = {
  loading: false,
  error: '',
};

const transactionsSubject$ = createSubject<IState>(initialState);

export const useTransactionsObservable = () => {
  const setError = (message: string) => {
    toast.error(message);
    setNextState({ error: message });
  };

  const setLoadingState = (state: boolean) => {
    setNextState({ loading: state });
  };

  const setNextState = (payload: Partial<IState>) => {
    const state = transactionsSubject$.getValue();
    transactionsSubject$.next({ ...state, ...payload });
  };

  const getObservable = () => {
    return transactionsSubject$;
  };

  return {
    setError,
    setLoadingState,
    getObservable,
  };
};
