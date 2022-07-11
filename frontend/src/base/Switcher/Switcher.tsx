import React, { useEffect, useState } from 'react';
import { FieldProps } from 'formik';
import { classMap } from '@shared/utils';
import { ISwitcherProps } from './Switcher.types';
import './Switcher.scss';

const Switcher = (props: ISwitcherProps & Partial<FieldProps>) => {
  const { value, onChange, options, form, field } = props;

  const getDefault = () => options[0].value;
  const [activeOption, setActiveOption] = useState(value ?? getDefault());

  useEffect(() => {
    if (value !== activeOption && onChange && field) onChange(activeOption);
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

  const handleKeydown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        const selectedValue = e.currentTarget.getAttribute('data-value') ?? getDefault();
        setActiveOption(selectedValue);
        break;
    }
  }

  return (
    <div className="SwitcherContainer">
      {options.map((item, index) => (
        <div
          key={`${item.value}_${index}`}
          tabIndex={0}
          className={classMap(
            { active: activeOption === item.value },
            'SwitcherOption',
          )}
          data-value={item.value}
          onClick={handleOptionSelect}
          onKeyDown={handleKeydown}
        >
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Switcher;
