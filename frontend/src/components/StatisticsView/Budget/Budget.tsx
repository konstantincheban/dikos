import { useStatisticsRepository } from '@repos';
import { BudgetData } from '@shared/interfaces';
import { useEffect, useState } from 'react';
import BudgetBarChart from '../Charts/BudgetBarChart';
import StatisticsDataController, {
  StatisticsDataControllerConfig,
} from '../StatisticsDataController/StatisticsDataController';
import './Budget.scss';

function Budget() {
  const { getBudgetStatisticsData } = useStatisticsRepository();
  const [chartData, setChartData] = useState<BudgetData[]>();
  const [dataConfig, setDataConfig] =
    useState<StatisticsDataControllerConfig>();

  useEffect(() => {
    const params = dataConfig ? Object.values(dataConfig) : [];
    params.length &&
      getBudgetStatisticsData(params).then(
        (data) => data && setChartData(data),
      );
  }, [dataConfig]);

  const handleControllerValueChanged = (
    config: StatisticsDataControllerConfig,
  ) => {
    setDataConfig(config);
  };

  return (
    <div className="BudgetContainer">
      <div className="TopSection">
        <span className="TopSectionTitle">Budget</span>
        <StatisticsDataController onChange={handleControllerValueChanged} />
      </div>
      <div className="ChartSection">
        {chartData ? <BudgetBarChart chartData={chartData} /> : ''}
      </div>
    </div>
  );
}

export default Budget;
