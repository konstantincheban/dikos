import { IForecast, IForecastResult } from '@shared/interfaces';
import { createSubject, useObservableBaseActions } from './utils';

export type AnalyticsState = {
  forecast: IForecast[];
  relatedTransactions: {
    [key: string]: IForecastResult[]
  }
}

const initialState = {
  forecast: [],
  relatedTransactions: {}
};

const analyticsSubject$ = createSubject<AnalyticsState>(initialState);

export const useAnalyticsObservable = () => {
  const actions = useObservableBaseActions<AnalyticsState, AnalyticsState>(
    analyticsSubject$
  );

  const setForecastData = (forecast: IForecast[]) => {
    actions.setNextState({ forecast: forecast });
  }

  const setForecastTransactionsData = (forecastID: string, transactions: IForecastResult[]) => {
    const state = analyticsSubject$.getValue();
    actions.setNextState({ relatedTransactions: {
      ...state.relatedTransactions,
      [forecastID]: transactions
    } });
  }

  return {
    ...actions,
    setForecastData,
    setForecastTransactionsData
  };
};
