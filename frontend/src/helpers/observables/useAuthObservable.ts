import { UserData } from '@interfaces';
import { textToID } from '@utils';
import { toast } from 'react-toastify';
import { createSubject, IState } from './utils';

export interface AuthState {
  username: string;
  email: string;
  token: string;
  budgetID: string;
}

const initialState = {
  username: '',
  email: '',
  budgetID: '',
  token: localStorage.getItem('token') ?? '',
  loading: false,
  error: '',
};

const authSubject$ = createSubject<IState<AuthState>>(initialState);

export const useAuthObservable = () => {
  const updateUserData = (userData: UserData) => {
    setNextState({ ...userData, error: '' });
  };

  const updateToken = (token: string) => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');

    setNextState({ token });
  };

  const setError = (message: string) => {
    toast.error(message, {
      toastId: textToID(message),
    });
    setNextState({ error: message });
  };

  const setLoadingState = (state: boolean) => {
    setNextState({ loading: state });
  };

  const setNextState = (
    payload: Partial<IState<Omit<AuthState, 'budgetID'>>>,
  ) => {
    const state = authSubject$.getValue();
    authSubject$.next({ ...state, ...payload });
  };

  const getObservable = () => {
    return authSubject$;
  };

  return {
    updateUserData,
    updateToken,
    setError,
    setLoadingState,
    getObservable,
  };
};
