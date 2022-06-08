import Card from '@base/Card';
import { useStatisticsRepository } from '@repos';
import { TopShopsStatisticsData } from '@shared/interfaces';
import { useEffect, useState } from 'react';
import PieChart from '../Charts/PieChart';

function Shop() {
  const [chartData, setChartData] = useState<TopShopsStatisticsData[]>();

  const { getTopShopsStatisticsData } = useStatisticsRepository();

  useEffect(() => {
    getTopShopsStatisticsData().then((data) => data && setChartData(data));
  }, []);

  const titleRenderer = () => {
    return (
      <div className="ChartCardTitle">
        <span>Top 5 Shops</span>
      </div>
    );
  };

  return (
    <Card
      className="ChartCardContainer ShopContainer"
      titleRenderer={titleRenderer}
    >
      <div className="ShopContentContainer">
        {chartData ? (
          <PieChart<TopShopsStatisticsData> chartData={chartData} />
        ) : (
          ''
        )}
      </div>
    </Card>
  );
}

export default Shop;
