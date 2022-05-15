import { axiosPublicInstance, axiosAuthInstance } from '@api';

export const useAuthApi = () => {
  const login = <RequestType>(data: RequestType) => {
    return axiosPublicInstance.post('/auth/login', data);
  };

  const registration = <RequestType>(data: RequestType) => {
    return axiosPublicInstance.post('/auth/registration', data);
  };

  const getUserData = () => {
    return axiosAuthInstance.get('/users/userData');
  };

  return {
    login,
    registration,
    getUserData,
  };
};
