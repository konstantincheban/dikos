import './AnalyticsView.scss';
import { useStore } from '@store';
import { useObservableState } from 'observable-hooks';
import Loader from '@base/Loader';

function AnalyticsView() {
  // const { analyticsState$ } = useStore();
  // const { loading } = useObservableState(analyticsState$);
  return (
    <div className="AnalyticsViewContainer">
      {false && <Loader />}
      <div className="ViewTitle">Analytics</div>
      <div className="AnalyticsChartsContainer">
      </div>
    </div>
  );
}

export default AnalyticsView;
