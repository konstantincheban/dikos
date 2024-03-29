import { IOptionProps, ISelectProps } from './Select.types';
import './Select.scss';
import { classMap } from '@shared/utils';
import Input from '@base/Input';
import { ArrowRightIcon, CloseIcon } from '@base/Icon/IconSet';
import Icon from '@base/Icon';
import React, { LegacyRef, useEffect, useRef, useState } from 'react';
import { FieldProps } from 'formik';

function Select(
  props: React.PropsWithChildren<ISelectProps> & Partial<FieldProps>,
) {
  const {
    children,
    readOnly,
    className,
    removeMode,
    value: defaultValue,
    form,
    field,
    onChange,
  } = props;
  const [value, setValue] = useState(field?.value ?? '');
  const [options, setOptions] = useState<React.ReactElement[]>();
  const [collapsed, setCollapsed] = useState(true);

  const inputRef = useRef<HTMLInputElement>();
  const listRef = useRef<HTMLUListElement>();

  const updateValue = (value: string) => {
    setValue(value);
    // Field Mode
    if (form && field) {
      form.setFieldValue(field.name, value);
      setTimeout(() => form.setFieldTouched(field.name, true, true));
    }
    onChange && onChange(value);

    setCollapsedValue(true);
    inputRef?.current?.focus();
  };

  useEffect(() => {
    const options = React.Children.map(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      React.Children.toArray(props.children),
      (child: React.ReactElement<IOptionProps>) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            onSelect: updateValue,
            active: child.props.value === value,
            collapsed: collapsed,
          });
        }
        return child;
      },
    );

    setOptions(options);
  }, [children, value, collapsed]);

  useEffect(() => {
    defaultValue && setValue(defaultValue);
  }, []);

  const setCollapsedValue = (value: boolean) => {
    setCollapsed(value);
    window.requestAnimationFrame(() => {
      !value && adjustHeight();
    })
  }

  const adjustHeight = () => {
    if (listRef.current) {
      const { bottom, height } = listRef.current.getBoundingClientRect();
      const diff = window.innerHeight - bottom;
      if (diff < 0) {
        listRef.current.style.height = `${height + diff - 30}px`;
      } else {
        listRef.current.style.height = 'auto';
      }
    }
  }

  const getRelatedLabelByValue = (value: string) => {
    const option = options?.find((option) => option.props.value === value);
    return option?.props.label ?? value;
  };

  const handleKeyDownEvent = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        setCollapsedValue(!collapsed);
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    const currentTarget = e.currentTarget;
    // Give browser time to focus the next element
    requestAnimationFrame(() => {
      // Check if the new focused element is a child of the original container
      if (!currentTarget.contains(document.activeElement)) {
        setCollapsedValue(true);
      }
    });
  };

  const renderSelectActions = () => {
    const sizeOfActions = 15;
    return (
      <div className="SelectActionsContainer">
        {removeMode ? (
          <div className="SelectAction">
            <Icon size={sizeOfActions} icon={<CloseIcon />} />
          </div>
        ) : null}
        <div className="SelectAction">
          <Icon
            className={classMap({ Down: collapsed, Up: !collapsed })}
            size={sizeOfActions}
            icon={<ArrowRightIcon />}
          />
        </div>
      </div>
    );
  };

  return (
    <div
      className={classMap(
        {
          [className as string]: !!className,
          readOnly: !!readOnly,
        },
        'SelectContainer',
      )}
      onBlur={handleBlur}
    >
      <Input
        ref={inputRef}
        readOnly
        className="SelectInput"
        value={getRelatedLabelByValue(value)}
        name={field?.name ?? 'selectInput'}
        onClick={() => setCollapsedValue(!collapsed)}
        onKeyDown={handleKeyDownEvent}
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={!collapsed}
      >
        {renderSelectActions()}
      </Input>
      <ul
        ref={listRef as LegacyRef<HTMLUListElement>}
        className={classMap({ collapsed: collapsed }, 'OptionsContainer')}
        role="listbox"
      >
        {options}
      </ul>
    </div>
  );
}

export default Select;
