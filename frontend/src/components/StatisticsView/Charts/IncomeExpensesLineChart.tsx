import { IncomeExpensesStatisticsData } from '@shared/interfaces';
import { dateFormatter } from '@shared/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { IChartProps } from './Charts.types';

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

const IncomeExpensesLineChart = (
  props: IChartProps<IncomeExpensesStatisticsData>,
) => {
  const { chartData } = props;
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid vertical={false} stroke="#737687" />
        <XAxis dataKey="name" tickFormatter={dateFormatter} axisLine={false} />
        <YAxis axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="income"
          stroke="#4799eb"
          strokeWidth={3}
          activeDot={{ r: 8 }}
        />
        <Line
          type="monotone"
          dataKey="expenses"
          stroke="#a23363"
          strokeWidth={3}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default IncomeExpensesLineChart;
