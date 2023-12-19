import Switcher from '@base/Switcher';
import { useStatisticsRepository } from '@repos';
import { IncomeExpensesStatisticsData } from '@shared/interfaces';
import { useEffect, useState } from 'react';
import IncomeExpensesBarChart from '../Charts/IncomeExpensesBarChart';
import IncomeExpensesLineChart from '../Charts/IncomeExpensesLineChart';
import StatisticsDataController, {
  StatisticsDataControllerConfig,
} from '../StatisticsDataController/StatisticsDataController';
import './IncomeExpenses.scss';

const VIEW_MODE_OPTIONS = [
  {
    value: 'barChart',
    label: 'Bar Chart',
  },
  {
    value: 'lineChart',
    label: 'Line Chart',
  },
];

function IncomeExpenses() {
  const [chartData, setChartData] = useState<IncomeExpensesStatisticsData[]>();
  const { getIncomeExpensesStatisticsData } = useStatisticsRepository();
  const [dataConfig, setDataConfig] =
    useState<StatisticsDataControllerConfig>();

  const [viewMode, setViewMode] = useState(VIEW_MODE_OPTIONS[0].value);

  useEffect(() => {
    const params = dataConfig ? Object.values(dataConfig) : [];
    params.length &&
      getIncomeExpensesStatisticsData(params).then(
        (data) => data && setChartData(data),
      );
  }, [dataConfig]);

  const handleChangeViewMode = (value: string) => {
    setViewMode(value);
  };

  const handleControllerValueChanged = (
    config: StatisticsDataControllerConfig,
  ) => {
    setDataConfig(config);
  };

  const renderChart = () => {
    if (viewMode === 'barChart' && chartData)
      return <IncomeExpensesBarChart chartData={chartData} />;
    if (viewMode === 'lineChart' && chartData)
      return <IncomeExpensesLineChart chartData={chartData} />;
  };

  return (
    <div className="IncomeExpensesContainer">
      <div className="TopSection">
        <div className="LeftSide">
          <span className="TopSectionTitle">Income & Expenses</span>
          <Switcher
            value={viewMode}
            options={VIEW_MODE_OPTIONS}
            onChange={handleChangeViewMode}
          />
        </div>
        <StatisticsDataController onChange={handleControllerValueChanged} />
      </div>
      <div className="ChartSection">{renderChart()}</div>
    </div>
  );
}

export default IncomeExpenses;
