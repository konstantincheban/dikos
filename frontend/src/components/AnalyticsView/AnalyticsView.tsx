import './AnalyticsView.scss';
import { useStore } from '@store';
import { useObservableState } from 'observable-hooks';
import Loader from '@base/Loader';
import Button from '@base/Button';
import { useModalAPI } from 'src/helpers/modalAPI/modalAPI';
import ForecastForm from './ForecastForm/ForecastForm';
import { createRef, useEffect, useState } from 'react';
import { ForecastOptions, IForecastResult, IModalFormRef } from '@shared/interfaces';
import { useAnalyticsRepository, useTransactionsRepository } from '@repos';
import { toast } from 'react-toastify';
import ForecastChart from './ForecastChart/ForecastChart';
import { capitalize } from '@shared/utils';

function AnalyticsView() {
  const { analyticsState$ } = useStore();
  const { loading, forecast: forecastData, relatedTransactions } = useObservableState(analyticsState$);

  const [forecastDataCumulativeSum, setForecastDataCumulativeSum] = useState<typeof forecastData>([]);
  const [relatedTransactionsCumulativeSum, setRelatedTransactionsCumulativeSum] = useState<typeof relatedTransactions>({});
  const [latestTransactionDate, setLatestTransactionDate] = useState(new Date().toISOString());

  const {
    forecast,
    getForecastedResults,
    getTransactionsForForecastedPeriod
  } = useAnalyticsRepository();

  const {
    getTransactions
  } = useTransactionsRepository();

  const { modalRef } = useModalAPI();

  const forecastModalRef = createRef<IModalFormRef>();

  useEffect(() => {
    getForecastedResults().then((forecasts) => {
      forecasts?.forEach((forecast) => {
        getTransactionsForForecastedPeriod(forecast._id, forecast.options.forecastType)
      })
    });
    getTransactions('?orderby=date desc&top=1').then((res) => {
      if (res?.length) {
        setLatestTransactionDate(res[0].date);
      }
    });
  }, []);

  const preProcessArrayOfResults = (arr: IForecastResult[]) => {
    let runningTotal = 0;
    return arr.map(item => {
      runningTotal += item.amount;
      return { ...item, amount: runningTotal };
    });
  }

  const isReversedChart = (dataset: IForecastResult[]) => dataset[0].amount < 0;

  useEffect(() => {
    if (forecastData.length) {
      const res = forecastData.map(forecast => ({ ...forecast, results: preProcessArrayOfResults(forecast.results)}));
      setForecastDataCumulativeSum(res);
    }
    if (Object.keys(relatedTransactions ?? {}).length) {
      const res: typeof relatedTransactions = {};
      Object.entries(relatedTransactions).forEach(([forecastID, transactions]) => {
        res[forecastID] = preProcessArrayOfResults(transactions);
      });
      setRelatedTransactionsCumulativeSum(res);
    }
  }, [forecastData, relatedTransactions])

  const handleForecast = (data: ForecastOptions) => {
    forecast(data.forecastType, data.period, data.startTime).then(() => {
      modalRef.current?.close();
    });
  }

  const handleValidateForecastForm = (
    validState: boolean,
    actionID: string,
  ) => {
    modalRef.current?.updateActionsState([
      {
        id: actionID,
        disabled: !validState,
      },
    ]);
  };

  const handleOpenForecastModal = () => {
    modalRef.current?.open({
      options: {
        title: 'Forecast income or expenses',
      },
      renderer: (
        <ForecastForm
          ref={forecastModalRef}
          latestTransactionDate={latestTransactionDate}
          onSubmitForm={handleForecast}
          validateForm={(validState: boolean) =>
            handleValidateForecastForm(validState, 'forecast')
          }
        />
      ),
      actions: [
        {
          id: 'forecast',
          label: 'Forecast',
          disabled: false,
          handler: () => forecastModalRef?.current?.submitForm(),
        },
      ],
    });
  };

  const renderForecastCharts = () => {
    if (forecastDataCumulativeSum.length) {
      return forecastDataCumulativeSum.map(
        (data, index) =>
          <div key={`${data.options.forecastType}_${index}`} className="AnalyticsChart">
            <div className="AnalyticsChartTitle">{capitalize(data.options.forecastType)} forecasting data: </div>
            <ForecastChart
              chartData={{ forecastData: data.results, transactionsData: relatedTransactionsCumulativeSum[data._id] ?? []}}
              reversed={isReversedChart(data.results)}
            ></ForecastChart>
          </div>
      )
    }
  }

  return (
    <div className="AnalyticsViewContainer">
      {loading && <Loader />}
      <div className="AnalyticsViewTopSection">
        <div className="ViewTitle">Analytics</div>
        <div className="ActionsBlock">
          <Button onClick={handleOpenForecastModal}>
            <span>Forecast</span>
          </Button>
        </div>
      </div>
      <div className="AnalyticsChartsContainer">
        {renderForecastCharts()}
      </div>
      {!forecastDataCumulativeSum.length ? <div className='ChartNoData'>There is no forecasting data, go ahead and generate your first forecast!</div> : ''}
    </div>
  );
}

export default AnalyticsView;
