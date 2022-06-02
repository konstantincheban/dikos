/* eslint-disable react/display-name */
import { IncomeOutcomeData } from '@shared/interfaces';
import { dateFormatter } from '@shared/utils';
import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Rectangle,
} from 'recharts';
import './Charts.scss';
import { IChartProps } from './Charts.types';

const renderBarShape =
  (id: 'income' | 'outcome') =>
  ({ height, width, x, y, fillOpacity }: any) => {
    const colors = {
      income: {
        from: '#00ddfa',
        to: '#4d33cc',
      },
      outcome: {
        from: '#e9354f',
        to: '#a23363',
      },
    };
    return (
      <svg
        key={`${id}_${x}`}
        x={x}
        y={y}
        fill="none"
        opacity={fillOpacity}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="0%" y2={`100%`}>
            <stop offset="0%" stopColor={colors[id].from} stopOpacity={1} />
            <stop offset="100%" stopColor={colors[id].to} stopOpacity={1} />
          </linearGradient>
        </defs>
        <rect fill={`url(#${id})`} width={width} height={height} />
      </svg>
    );
  };

const CustomCursor = (props: any) => {
  const { x, y, width, height } = props;
  return (
    <Rectangle
      fill="rgba(71, 153, 235, 0.2)"
      x={x}
      y={y}
      width={width}
      height={height}
    />
  );
};

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

const IncomeOutcomeBarChart = (props: IChartProps<IncomeOutcomeData>) => {
  const { chartData } = props;
  const [focusBar, setFocusBar] = useState('');

  const handleLegendMouseEnter = ({ dataKey }: any) => {
    setFocusBar(dataKey);
  };
  const handleLegendMouseLeave = () => {
    setFocusBar('');
  };

  return (
    <div className="IncomeOutcomeBarChart">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid vertical={false} stroke="#737687" />
          <XAxis
            dataKey="name"
            tickFormatter={dateFormatter}
            axisLine={false}
          />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip cursor={<CustomCursor />} content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
            }}
            onMouseEnter={handleLegendMouseEnter}
            onMouseLeave={handleLegendMouseLeave}
          />
          <Bar
            dataKey="income"
            minPointSize={10}
            fill="#4d33cc"
            fillOpacity={focusBar === 'income' || !focusBar ? 1 : 0.3}
            shape={renderBarShape('income')}
          />
          <Bar
            dataKey="outcome"
            minPointSize={5}
            fill="#a23363"
            fillOpacity={focusBar === 'outcome' || !focusBar ? 1 : 0.3}
            shape={renderBarShape('outcome')}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeOutcomeBarChart;
