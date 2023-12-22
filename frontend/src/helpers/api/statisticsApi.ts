import { axiosAuthInstance } from './index';

export const useStatisticsApi = () => {
  const getIncomeExpensesStatisticsData = (params?: string[]) => {
    return axiosAuthInstance.get(
      `/statistics/income_expenses/${params?.join('/') ?? ''}`,
    );
  };

  const getBudgetStatisticsData = (params?: string[]) => {
    return axiosAuthInstance.get(
      `/statistics/budget/${params?.join('/') ?? ''}`,
    );
  };

  const getTopCategoriesStatisticsData = () => {
    return axiosAuthInstance.get(`/statistics/top_categories`);
  };

  const getTopShopsStatisticsData = () => {
    return axiosAuthInstance.get(`/statistics/top_shops`);
  };

  return {
    getIncomeExpensesStatisticsData,
    getBudgetStatisticsData,
    getTopCategoriesStatisticsData,
    getTopShopsStatisticsData,
  };
};
