import { TopCategoriesData, TopShopsData } from '@interfaces';
import { setErrorToState } from './utils';
import { useStatisticsObservable } from '../observables';
import { useStatisticsApi } from '@api';
import { AxiosResponse } from 'axios';
import { BudgetData, IncomeOutcomeData } from '@shared/interfaces';

export const useStatisticsRepository = () => {
  const statisticsApi = useStatisticsApi();
  const statisticsObservable = useStatisticsObservable();

  const getIncomeOutcomeStatisticsData = async (parameters?: string[]) => {
    statisticsObservable.setLoadingState(true);
    return await statisticsApi
      .getIncomeOutcomeStatisticsData(parameters)
      .then(({ data }: AxiosResponse<IncomeOutcomeData[]>) => {
        statisticsObservable.setLoadingState(false);
        return data;
      })
      .catch((err) => setErrorToState(err, statisticsObservable));
  };

  const getBudgetStatisticsData = async (parameters?: string[]) => {
    statisticsObservable.setLoadingState(true);
    return await statisticsApi
      .getBudgetStatisticsData(parameters)
      .then(({ data }: AxiosResponse<BudgetData[]>) => {
        statisticsObservable.setLoadingState(false);
        return data;
      })
      .catch((err) => setErrorToState(err, statisticsObservable));
  };

  const getTopCategoriesStatisticsData = async () => {
    statisticsObservable.setLoadingState(true);
    return await statisticsApi
      .getTopCategoriesStatisticsData()
      .then(({ data }: AxiosResponse<TopCategoriesData[]>) => {
        statisticsObservable.setLoadingState(false);
        return data;
      })
      .catch((err) => setErrorToState(err, statisticsObservable));
  };

  const getTopShopsStatisticsData = async () => {
    statisticsObservable.setLoadingState(true);
    return await statisticsApi
      .getTopShopsStatisticsData()
      .then(({ data }: AxiosResponse<TopShopsData[]>) => {
        statisticsObservable.setLoadingState(false);
        return data;
      })
      .catch((err) => setErrorToState(err, statisticsObservable));
  };

  const getStatisticsObservable = () => statisticsObservable.getObservable();

  return {
    getIncomeOutcomeStatisticsData,
    getBudgetStatisticsData,
    getTopCategoriesStatisticsData,
    getTopShopsStatisticsData,
    getStatisticsObservable,
  };
};
