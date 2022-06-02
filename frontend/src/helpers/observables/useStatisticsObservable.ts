import { textToID } from '@shared/utils';
import { toast } from 'react-toastify';
import { createSubject, IState } from './utils';

const initialState = {
  loading: false,
  error: '',
};

const statisticsSubject$ = createSubject<IState>(initialState);

export const useStatisticsObservable = () => {
  const setError = (message: string) => {
    toast.error(message, {
      toastId: textToID(message),
    });
    setNextState({ error: message, loading: false });
  };

  const setLoadingState = (state: boolean) => {
    setNextState({ loading: state });
  };

  const setNextState = (payload: Partial<IState>) => {
    const state = statisticsSubject$.getValue();
    statisticsSubject$.next({ ...state, ...payload });
  };

  const getObservable = () => {
    return statisticsSubject$;
  };

  return {
    setError,
    setLoadingState,
    getObservable,
  };
};
