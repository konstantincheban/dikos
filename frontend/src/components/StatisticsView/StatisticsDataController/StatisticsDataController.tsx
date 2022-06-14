import { Select, Option } from '@base/Select';
import moment from 'moment';
import { useEffect, useState } from 'react';
import './StatisticsDataController.scss';

interface IStatisticsDataControllerProps {
  onChange: (config: StatisticsDataControllerConfig) => void;
}

export type StatisticsDataControllerConfig = {
  byDate: string;
  byDateDetail: string;
};

const BY_DATE_OPTIONS = [
  {
    value: 'in_one_month',
    label: 'In one month',
  },
  {
    value: 'in_one_year',
    label: 'In one year',
  },
];

const IN_ONE_MONTH_OPTIONS = moment.months().map((monthName) => ({
  value: moment().month(monthName).format('MM'),
  label: monthName,
}));

function StatisticsDataController(props: IStatisticsDataControllerProps) {
  const defaultByDateOption = BY_DATE_OPTIONS[0].value;
  // use current month by default
  const defaultByDateDetailOption =
    IN_ONE_MONTH_OPTIONS.find((month) => month.value === moment().format('MM'))
      ?.value ?? IN_ONE_MONTH_OPTIONS[0].value;

  const [byDateOption, setByDateOption] = useState(defaultByDateOption);
  const [byDateDetailOption, setByDateDetailOption] = useState(
    defaultByDateDetailOption,
  );

  useEffect(() => {
    if (byDateOption || byDateDetailOption) {
      props.onChange({
        byDate: byDateOption,
        byDateDetail: byDateDetailOption,
      });
    }
  }, [byDateOption, byDateDetailOption]);

  const handleSelectByDateOption = (value: string) => {
    setByDateOption(value);
    if (value === 'in_one_year') setByDateDetailOption('');
    else setByDateDetailOption(defaultByDateDetailOption);
  };

  const handleSelectByDateDetailOption = (value: string) => {
    setByDateDetailOption(value);
  };

  return (
    <div className="StatisticsDataControllerContainer">
      {byDateDetailOption ? (
        <Select
          className="DateDetailsController"
          value={byDateDetailOption}
          onChange={handleSelectByDateDetailOption}
        >
          {IN_ONE_MONTH_OPTIONS.map((item, index) => (
            <Option key={`${item.value}_${index}`} {...item} />
          ))}
        </Select>
      ) : (
        ''
      )}
      <Select
        className="DateController"
        value={byDateOption}
        onChange={handleSelectByDateOption}
      >
        {BY_DATE_OPTIONS.map((item, index) => (
          <Option key={`${item.value}_${index}`} {...item} />
        ))}
      </Select>
    </div>
  );
}

export default StatisticsDataController;
