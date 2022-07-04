import { AxiosResponse } from 'axios';
import { setErrorToState, repoWrapper } from './utils';
import { useAuthObservable } from '@observables';
import { useAuthApi } from '@api';
import {
  LoginResponse,
  LoginRequest,
  RegistrationRequest,
  RegistrationResponse,
  UserData,
} from '@interfaces';

export const useAuthRepository = () => {
  const authApi = useAuthApi();
  const authObservable = useAuthObservable();

  const login = (data: LoginRequest) => {
    return repoWrapper(authObservable, () =>
      authApi
        .login<LoginRequest>(data)
        .then(({ data }: AxiosResponse<LoginResponse>) => {
          authObservable.updateToken(data.token);
        })
        .catch((err) => setErrorToState(err, authObservable)),
    );
  };

  const registration = (data: RegistrationRequest) => {
    return repoWrapper(authObservable, () =>
      authApi
        .registration<RegistrationRequest>(data)
        .then(({ data }: AxiosResponse<RegistrationResponse>) => {
          authObservable.updateToken(data.token);
        })
        .catch((err) => setErrorToState(err, authObservable)),
    );
  };

  const logout = async () => {
    try {
      authObservable.updateToken('');
    } catch (err) {
      setErrorToState(err, authObservable);
    }
  };

  const getUserData = () => {
    return repoWrapper(authObservable, () =>
      authApi
        .getUserData()
        .then(({ data }: AxiosResponse<UserData>) => {
          authObservable.updateUserData(data);
          return data;
        })
        .catch((err) => setErrorToState(err, authObservable)),
    );
  };

  const getAuthObservable = () => authObservable.getObservable();

  return {
    login,
    registration,
    logout,
    getUserData,
    getAuthObservable
  };
};
