import { PERIODS, FORECAST_TYPES } from '../analytics.service'
export type Periods = typeof PERIODS[number];
export type ForecastTypes = typeof FORECAST_TYPES[number];

export class ForecastBodyDTO {
  period: Periods;
  startTime: string;
}
