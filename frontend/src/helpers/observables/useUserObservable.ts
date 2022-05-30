import { textToID } from '@shared/utils';
import { toast } from 'react-toastify';
import { createSubject, IState } from './utils';
import { BudgetData } from '@shared/interfaces';

export interface UserState {
  budgetData: BudgetData;
}

const initialState = {
  budgetData: {
    amount: 0,
    plannedCosts: 0,
    perDay: 0,
  },
  loading: false,
  error: '',
};

const userSubject$ = createSubject<IState<UserState>>(initialState);

export const useUsersObservable = () => {
  const updateBudgetData = (data: BudgetData) => {
    setNextState({ budgetData: data, error: '' });
  };

  const setError = (message: string) => {
    toast.error(message, {
      toastId: textToID(message),
    });
    setNextState({ error: message, loading: false });
  };

  const setLoadingState = (state: boolean) => {
    setNextState({ loading: state });
  };

  const setNextState = (payload: Partial<IState<UserState>>) => {
    const state = userSubject$.getValue();
    userSubject$.next({ ...state, ...payload });
  };

  const getObservable = () => {
    return userSubject$;
  };

  return {
    setError,
    updateBudgetData,
    setLoadingState,
    getObservable,
  };
};
