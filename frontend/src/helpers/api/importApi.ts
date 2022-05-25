import { axiosAuthInstance } from './index';

export const useImportApi = () => {
  axiosAuthInstance.defaults.headers.common = {
    'Content-Type': 'multipart/form-data',
  };
  const importMetroTransactions = <RequestType>(data: RequestType) => {
    return axiosAuthInstance.post('/metro/import', data);
  };

  return {
    importMetroTransactions,
  };
};
