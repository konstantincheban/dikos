import {
  TopCategoriesStatisticsData,
  TopShopsStatisticsData,
  BudgetStatisticsData,
  IncomeOutcomeStatisticsData,
} from '@interfaces';
import { setErrorToState, repoWrapper } from './utils';
import { useStatisticsObservable } from '@observables';
import { useStatisticsApi } from '@api';
import { AxiosResponse } from 'axios';

export const useStatisticsRepository = () => {
  const statisticsApi = useStatisticsApi();
  const statisticsObservable = useStatisticsObservable();

  const getIncomeOutcomeStatisticsData = (parameters?: string[]) => {
    return repoWrapper(statisticsObservable, () =>
      statisticsApi
        .getIncomeOutcomeStatisticsData(parameters)
        .then(({ data }: AxiosResponse<IncomeOutcomeStatisticsData[]>) => data)
        .catch((err) => setErrorToState(err, statisticsObservable)),
    );
  };

  const getBudgetStatisticsData = (parameters?: string[]) => {
    return repoWrapper(statisticsObservable, () =>
      statisticsApi
        .getBudgetStatisticsData(parameters)
        .then(({ data }: AxiosResponse<BudgetStatisticsData[]>) => data)
        .catch((err) => setErrorToState(err, statisticsObservable)),
    );
  };

  const getTopCategoriesStatisticsData = () => {
    return repoWrapper(statisticsObservable, () =>
      statisticsApi
        .getTopCategoriesStatisticsData()
        .then(({ data }: AxiosResponse<TopCategoriesStatisticsData[]>) => data)
        .catch((err) => setErrorToState(err, statisticsObservable)),
    );
  };

  const getTopShopsStatisticsData = () => {
    return repoWrapper(statisticsObservable, () =>
      statisticsApi
        .getTopShopsStatisticsData()
        .then(({ data }: AxiosResponse<TopShopsStatisticsData[]>) => data)
        .catch((err) => setErrorToState(err, statisticsObservable)),
    );
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
