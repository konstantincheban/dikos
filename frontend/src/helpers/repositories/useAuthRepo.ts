import { AxiosResponse } from 'axios';
import { setErrorToState } from './utils';
import { useAuthObservable } from '../observables';
import { useAuthApi } from '@api';
import {
  LoginResponse,
  LoginRequest,
  RegistrationRequest,
  RegistrationResponse,
} from '@shared/interfaces';

export const useAuthRepository = () => {
  const authApi = useAuthApi();
  const authObservable = useAuthObservable();

  const login = async (data: LoginRequest) => {
    authObservable.setLoadingState(true);
    authApi
      .login<LoginRequest>(data)
      .then(({ data }: AxiosResponse<LoginResponse>) => {
        authObservable.updateUserData(data);
        authObservable.updateToken(data.token);
        authObservable.setLoadingState(false);
      })
      .catch((err) => setErrorToState(err, authObservable));
  };

  const registration = async (data: RegistrationRequest) => {
    authObservable.setLoadingState(true);
    authApi
      .registration<RegistrationRequest>(data)
      .then(({ data }: AxiosResponse<RegistrationResponse>) => {
        authObservable.updateUserData(data);
        authObservable.updateToken(data.token);
        authObservable.setLoadingState(false);
      })
      .catch((err) => setErrorToState(err, authObservable));
  };

  const logout = async () => {
    try {
      authObservable.updateToken('');
    } catch (err) {
      setErrorToState(err, authObservable);
    }
  };

  const getUserData = async () => {
    authObservable.setLoadingState(true);
    authApi
      .getUserData()
      .then(({ data }: AxiosResponse<LoginResponse>) => {
        authObservable.updateUserData(data);
        authObservable.setLoadingState(false);
      })
      .catch((err) => setErrorToState(err, authObservable));
  };

  const clearToken = () => {
    localStorage.removeItem('token');
    authObservable.updateToken('');
  };

  const getAuthObservable = () => authObservable.getObservable();

  return {
    login,
    registration,
    logout,
    getUserData,
    getAuthObservable,
    clearToken,
  };
};
