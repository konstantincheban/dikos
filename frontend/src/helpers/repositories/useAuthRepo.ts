import { AxiosResponse } from 'axios';
import { setErrorToState } from './utils';
import { useNavigate } from 'react-router-dom';
import { useAuthObservable } from '../observables';
import { useAuthApi } from '@api';
import {
  LoginResponse,
  LoginRequest,
  RegistrationRequest,
  RegistrationResponse,
} from '@shared/interfaces';

export const useAuthRepository = () => {
  const navigate = useNavigate();
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
        navigate('/');
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
        navigate('/');
      })
      .catch((err) => setErrorToState(err, authObservable));
  };

  const logout = async () => {
    try {
      authObservable.updateToken('');
      navigate('/');
    } catch (err) {
      setErrorToState(err, authObservable);
    }
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
    getAuthObservable,
    clearToken,
  };
};
