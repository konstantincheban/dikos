import axios from 'axios';

const BASE_API_URL = process.env.BASE_API_URL;

export const useAuthApi = () => {
  const login = <RequestType>(data: RequestType) => {
    return axios.post(`${BASE_API_URL}/auth/login`, data);
  };

  const registration = <RequestType>(data: RequestType) => {
    return axios.post(`${BASE_API_URL}/auth/registration`, data);
  };

  return {
    login,
    registration,
  };
};
