import { IForecast } from "@shared/interfaces";

export interface IForecastChartProps {
  chartData: {
    forecastData: IForecast['results'];
    transactionsData: IForecast['results'];
  }
  reversed: boolean;
}