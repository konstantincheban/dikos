import { dateFormatter } from '@shared/utils';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import '../../StatisticsView/Charts/Charts.scss';
import { IForecastChartProps } from './ForecastChart.types';

const CustomTooltip = (props: any) => {
  const { active, payload } = props;
  if (active && payload?.length) {
    return (
      <div className="CustomTooltipContainer">
        {payload.map((item: any, index: number) => (
          <div
            key={`${item.name}_${index}`}
            className="CustomTooltipKeyValue"
            style={{ color: item.color }}
          >
            <span className="CustomTooltipKey">{item.name}</span>
            <span className="CustomTooltipValue">{item.value}</span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

const ForecastLineChart = (
  props: IForecastChartProps,
) => {
  const { chartData, reversed } = props;
  const domainData = chartData.forecastData.map(item => item.dateTime);
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart>
        <CartesianGrid vertical={false} stroke="#737687" />
        <XAxis xAxisId="forecast" dataKey="dateTime" tickFormatter={dateFormatter} axisLine={false} domain={['auto', 'auto']} />
        <XAxis xAxisId="transactions" hide={true} dataKey="dateTime" tickFormatter={dateFormatter} axisLine={false} domain={domainData} />
        <YAxis axisLine={false} tickLine={false} reversed={reversed} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="amount"
          name="Forecast amount"
          xAxisId="forecast"
          data={chartData.forecastData}
          stroke="#4799eb"
          strokeWidth={3}
          activeDot={{ r: 8 }}
        />
        <Line
          type="monotone"
          dataKey="amount"
          name="Transactions amount"
          xAxisId="transactions"
          data={chartData.transactionsData}
          stroke="#a23363"
          strokeWidth={3}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

function ForecastChart({
  chartData,
  reversed
}: IForecastChartProps) {

  const renderChart = () => {
    return <ForecastLineChart chartData={chartData} reversed={reversed}></ForecastLineChart>
  };

  return (
    <div className="ForecastChartContainer">
      <div className="ChartSection">{renderChart()}</div>
    </div>
  );
}

export default ForecastChart;
