import { UserData } from '@interfaces';
import { createSubject, IState, useObservableBaseActions } from './utils';

export interface AuthState {
  username: string;
  email: string;
  token: string;
  budgetID: string;
}

type Payload = Omit<AuthState, 'budgetID'>;

const initialState = {
  username: '',
  email: '',
  budgetID: '',
  token: localStorage.getItem('token') ?? '',
};

const authSubject$ = createSubject<AuthState>(initialState);

export const useAuthObservable = () => {
  const actions = useObservableBaseActions<AuthState, Payload>(authSubject$);

  const updateUserData = (userData: UserData) => {
    actions.setNextState({ ...userData, error: '' });
  };

  const updateToken = (token: string) => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');

    actions.setNextState({ token });
  };

  return {
    ...actions,
    updateUserData,
    updateToken,
  };
};
