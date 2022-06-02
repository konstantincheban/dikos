import Loader from '@base/Loader';
import { useStore } from '@store';
import { useObservableState } from 'observable-hooks';
import Budget from './Budget/Budget';
import Category from './Category/Category';
import IncomeOutcome from './IncomeOutcome/IncomeOutcome';
import Shop from './Shop/Shop';
import './StatisticsView.scss';

function StatisticsView() {
  const { statisticsState$ } = useStore();
  const { loading } = useObservableState(statisticsState$);
  return (
    <div className="StatisticsViewContainer">
      {loading && <Loader />}
      <div className="ViewTitle">Statistics</div>
      <div className="StatisticsChartsContainer">
        <IncomeOutcome />
        <Budget />
        <div className="PieCharts">
          <Category />
          <Shop />
        </div>
      </div>
    </div>
  );
}

export default StatisticsView;
