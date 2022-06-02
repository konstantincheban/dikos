import { axiosAuthInstance } from './index';

export const useStatisticsApi = () => {
  const getIncomeOutcomeStatisticsData = (params?: string[]) => {
    return axiosAuthInstance.get(
      `/statistics/income_outcome/${params?.join('/') ?? ''}`,
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
    getIncomeOutcomeStatisticsData,
    getBudgetStatisticsData,
    getTopCategoriesStatisticsData,
    getTopShopsStatisticsData,
  };
};
