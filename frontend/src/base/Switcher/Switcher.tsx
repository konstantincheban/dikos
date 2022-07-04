import { useEffect, useState } from 'react';
import { FieldProps } from 'formik';
import { classMap } from '@shared/utils';
import { ISwitcherProps } from './Switcher.types';
import './Switcher.scss';

const Switcher = (props: ISwitcherProps & Partial<FieldProps>) => {
  const { value, onChange, options, form, field } = props;

  const getDefault = () => options[0].value;
  const [activeOption, setActiveOption] = useState(getDefault());

  useEffect(() => {
    if (value !== activeOption && onChange) onChange(activeOption);
  }, [activeOption, value]);

  useEffect(() => {
    // Field Mode
    setToFieldValue(activeOption);
  }, [activeOption]);

  const setToFieldValue = (value: string | null | undefined) => {
    if (form && field && value) {
      form.setFieldValue(field.name, value);
    }
  };

  const handleOptionSelect = (e: React.MouseEvent) => {
    const selectedValue = e.currentTarget.getAttribute('data-value') ?? getDefault();
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
