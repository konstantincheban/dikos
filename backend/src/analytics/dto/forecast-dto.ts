import { IsDate, IsIn } from 'class-validator';
import { PERIODS, FORECAST_TYPES } from '../analytics.service'
import { Type } from 'class-transformer';
export type Periods = typeof PERIODS[number];
export type ForecastTypes = typeof FORECAST_TYPES[number];

export class ForecastBodyDTO {
  @IsIn(PERIODS)
  period: Periods;

  @IsDate()
  @Type(() => Date)
  startTime: string;
}
