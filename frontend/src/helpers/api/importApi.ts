import { axiosAuthInstance } from './index';

export const useImportApi = () => {
  axiosAuthInstance.defaults.headers.common = {
    'Content-Type': 'multipart/form-data',
  };
  const importMetroTransactions = <RequestType>(data: RequestType) => {
    return axiosAuthInstance.post('/metro/import', data);
  };

  const importMonoTransactions = <RequestType>(data: RequestType) => {
    return axiosAuthInstance.post('/mono/import', data);
  };

  return {
    importMetroTransactions,
    importMonoTransactions
  };
};
