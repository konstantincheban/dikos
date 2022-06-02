import Switcher from '@base/Switcher';
import { useStatisticsRepository } from '@repos';
import { IncomeOutcomeData } from '@shared/interfaces';
import { useEffect, useState } from 'react';
import IncomeOutcomeBarChart from '../Charts/IncomeOutcomeBarChart';
import IncomeOutcomeLineChart from '../Charts/IncomeOutcomeLineChart';
import StatisticsDataController, {
  StatisticsDataControllerConfig,
} from '../StatisticsDataController/StatisticsDataController';
import './IncomeOutcome.scss';

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

function IncomeOutcome() {
  const [chartData, setChartData] = useState<IncomeOutcomeData[]>();
  const { getIncomeOutcomeStatisticsData } = useStatisticsRepository();
  const [dataConfig, setDataConfig] =
    useState<StatisticsDataControllerConfig>();

  const [viewMode, setViewMode] = useState(VIEW_MODE_OPTIONS[0].value);

  useEffect(() => {
    const params = dataConfig ? Object.values(dataConfig) : [];
    params.length &&
      getIncomeOutcomeStatisticsData(params).then(
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
      return <IncomeOutcomeBarChart chartData={chartData} />;
    if (viewMode === 'lineChart' && chartData)
      return <IncomeOutcomeLineChart chartData={chartData} />;
  };

  return (
    <div className="IncomeOutcomeContainer">
      <div className="TopSection">
        <div className="LeftSide">
          <span className="TopSectionTitle">Income & Outcome</span>
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

export default IncomeOutcome;
