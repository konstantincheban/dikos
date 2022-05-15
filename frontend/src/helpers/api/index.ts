import { useAuthRepository } from '@repos';
import { useAuthObservable } from '@observables';
import axios from 'axios';

export * from './authApi';
export * from './accountsApi';
export * from './transactionsApi';
export * from './utils';

export const axiosPublicInstance = axios.create({
  baseURL: process.env.BASE_API_URL,
  timeout: 1000,
});

export const axiosAuthInstance = axios.create({
  baseURL: process.env.BASE_API_URL,
  timeout: 1000,
});

axiosAuthInstance.interceptors.request.use(
  (config) => {
    const { getObservable } = useAuthObservable();
    const jwtToken = getObservable().getValue().token;
    if (config?.headers && !config.headers.Authorization && jwtToken) {
      config.headers.Authorization = `Bearer ${jwtToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosAuthInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      const authRepo = useAuthRepository();
      authRepo.logout();
    }
    return Promise.reject(error);
  },
);
