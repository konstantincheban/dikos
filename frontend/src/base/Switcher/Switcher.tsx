import { ISwitcherProps } from './Switcher.types';
import { classMap } from '@shared/utils';
import './Switcher.scss';
import { useEffect, useState } from 'react';

const Switcher = (props: ISwitcherProps) => {
  const { value, onChange, options } = props;
  const [activeOption, setActiveOption] = useState(value);

  useEffect(() => {
    if (value !== activeOption) onChange(activeOption);
  }, [activeOption, value]);

  const handleOptionSelect = (e: React.MouseEvent) => {
    const selectedValue = e.currentTarget.getAttribute('data-value') ?? value;
    setActiveOption(selectedValue);
  };

  return (
    <div className="SwitcherContainer">
      {options.map((item, index) => (
        <div
          key={`${item.value}_${index}`}
          className={classMap(
            { active: activeOption === item.value },
            'SwitcherOption',
          )}
          data-value={item.value}
          onClick={(e) => handleOptionSelect(e)}
        >
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Switcher;
