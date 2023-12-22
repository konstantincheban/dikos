
import { SUPPORTED_FORECAST_PERIODS } from "@components/AnalyticsView/ForecastForm/ForecastFormConfigurations";

export type ForecastPeriods = typeof SUPPORTED_FORECAST_PERIODS[number];
export type ForecastType = 'income' | 'expenses';
export type ForecastOptions = {
  period: ForecastPeriods,
  forecastType: ForecastType,
  startTime: string
};

export interface IForecastResult {
  dateTime: string;
  amount: number
}

export interface IForecastOptions {
  forecastType: ForecastType;
  period: ForecastPeriods;
  nTransaction: number;
  startTime: string;
  modelVersion: string;
}

export interface IForecast {
  _id: string;
  userID: string;
  results: IForecastResult[];
  options: IForecastOptions;
  created_at: Date;
  updated_at: Date;
}