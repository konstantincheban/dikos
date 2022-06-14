import Card from '@base/Card';
import { useStatisticsRepository } from '@repos';
import { TopCategoriesStatisticsData } from '@shared/interfaces';
import { useEffect, useState } from 'react';
import PieChart from '../Charts/PieChart';
import '../Charts/Charts.scss';

function Category() {
  const [chartData, setChartData] = useState<TopCategoriesStatisticsData[]>();
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
        {chartData?.length ? (
          <PieChart<TopCategoriesStatisticsData> chartData={chartData} />
        ) : (
          <div className="ChartNoData">No data</div>
        )}
      </div>
    </Card>
  );
}

export default Category;
