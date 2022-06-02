import Card from '@base/Card';
import { useStatisticsRepository } from '@repos';
import { TopCategoriesData } from '@shared/interfaces';
import { useEffect, useState } from 'react';
import PieChart from '../Charts/PieChart';

function Category() {
  const [chartData, setChartData] = useState<TopCategoriesData[]>();
  const { getTopCategoriesStatisticsData } = useStatisticsRepository();

  useEffect(() => {
    getTopCategoriesStatisticsData().then((data) => data && setChartData(data));
  }, []);

  const titleRenderer = () => {
    return (
      <div className="ChartCardTitle">
        <span>Top 5 Categories</span>
      </div>
    );
  };

  return (
    <Card
      className="ChartCardContainer CategoryContainer"
      titleRenderer={titleRenderer}
    >
      <div className="CategoryContentContainer">
        {chartData ? <PieChart<TopCategoriesData> chartData={chartData} /> : ''}
      </div>
    </Card>
  );
}

export default Category;
