import { toast } from 'react-toastify';
import { createSubject, IState } from './utils';

export interface AuthState {
  username: string;
  userId: string;
  email: string;
  token: string;
}

const initialState = {
  username: '',
  userId: '',
  email: '',
  token: localStorage.getItem('token') ?? '',
  loading: false,
  error: '',
};

const authSubject$ = createSubject<IState<AuthState>>(initialState);

export const useAuthObservable = () => {
  const updateUserData = (userData: AuthState) => {
    setNextState(userData);
  };

  const updateToken = (token: string) => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');

    setNextState({ token });
  };

  const setError = (message: string) => {
    toast.error(message);
    setNextState({ error: message });
  };

  const setLoadingState = (state: boolean) => {
    setNextState({ loading: state });
  };

  const setNextState = (payload: Partial<IState<AuthState>>) => {
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
