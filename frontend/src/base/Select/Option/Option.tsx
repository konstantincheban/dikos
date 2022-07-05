import { classMap } from '@shared/utils';
import React from 'react';
import { IOptionProps } from '../Select.types';
import './Option.scss';

function Option(props: IOptionProps) {
  const { label, value, active, collapsed, onSelect } = props;

  const handleKeyDownEvent = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        onSelect && onSelect(value);
    }
  };

  return (
    <li
      className={classMap({ active: !!active }, 'OptionContainer')}
      onClick={() => onSelect && onSelect(value)}
      onKeyDown={handleKeyDownEvent}
      tabIndex={collapsed ? -1 : 0}
      role="option"
      aria-selected={active}
    >
      {label}
    </li>
  );
}

export default Option;
