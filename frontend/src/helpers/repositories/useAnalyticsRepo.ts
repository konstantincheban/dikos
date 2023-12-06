import {
  ForecastType,
  ForecastPeriods,
  IForecast,
  IForecastResult,
} from '@interfaces';
import { setErrorToState, repoWrapper } from './utils';
import { useAnalyticsObservable } from '@observables';
import { useAnalyticsApi } from '@api';
import { AxiosResponse } from 'axios';

export const useAnalyticsRepository = () => {
  const analyticsApi = useAnalyticsApi();
  const analyticsObservable = useAnalyticsObservable();

  const forecast = (forecastType: ForecastType, period: ForecastPeriods, startTime: string) => {
    return repoWrapper(analyticsObservable, () =>
      analyticsApi
        .forecast(forecastType, period, startTime)
        .then(({ data }: AxiosResponse<IForecast>) => data)
        .catch((err) => setErrorToState(err, analyticsObservable)),
    );
  };

  const getForecastedResults = () => {
    return repoWrapper(analyticsObservable, () =>
      analyticsApi
        .getForecastedResults()
        .then(({ data }: AxiosResponse<IForecast[]>) => {
          analyticsObservable.setForecastData(data);
          return data;
        })
        .catch((err) => setErrorToState(err, analyticsObservable)),
    );
  };

  const getTransactionsForForecastedPeriod = (forecastID: string, forecastType: ForecastType) => {
    return repoWrapper(analyticsObservable, () =>
      analyticsApi
        .getTransactionsForForecastedPeriod(forecastID, forecastType)
        .then(({ data }: AxiosResponse<IForecastResult[]>) => {
          analyticsObservable.setForecastTransactionsData(forecastID, data);
          return data;
        })
        .catch((err) => setErrorToState(err, analyticsObservable)),
    );
  };

  const getAnalyticsObservable = () => analyticsObservable.getObservable();

  return {
    forecast,
    getAnalyticsObservable,
    getForecastedResults,
    getTransactionsForForecastedPeriod
  };
};
