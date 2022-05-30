import { axiosAuthInstance } from '@api';

export const useUserApi = () => {
  const editBudgetData = <RequestType>(data: RequestType, budgetID: string) => {
    return axiosAuthInstance.post(`/budget/edit/${budgetID}`, data);
  };

  const getBudgetData = (budgetID: string) => {
    return axiosAuthInstance.get(`/budget/${budgetID}`);
  };

  return {
    editBudgetData,
    getBudgetData,
  };
};
