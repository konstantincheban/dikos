import { ForecastPeriods, ForecastType } from '@shared/interfaces';
import { axiosAuthInstance } from './index';

export const useAnalyticsApi = () => {
  const forecast = (forecastType: ForecastType, period: ForecastPeriods, startTime: string) => {
    return axiosAuthInstance.post(
      `/analytics/forecast/${forecastType}`,
      {
        period: period,
        startTime: startTime
      }
    );
  };

  const getForecastedResults = () => {
    return axiosAuthInstance.get(
      `/analytics/forecast/results`
    );
  };

  const getTransactionsForForecastedPeriod = (forecastID: string, forecastType: ForecastType) => {
    return axiosAuthInstance.get(
      `/analytics/forecast/transactions/${forecastType}/${forecastID}`
    );
  };

  return {
    forecast,
    getForecastedResults,
    getTransactionsForForecastedPeriod
  };
};
