import { ICheckboxProps } from './Checkbox.types';
import './Checkbox.scss';
import {
  ChangeEvent,
  forwardRef,
  LegacyRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { FieldProps } from 'formik';
import Icon from '@base/Icon';
import { CheckedCellIcon, UncheckedCellIcon } from '@base/Icon/IconSet';
import { usePrevious } from '@hooks';

const Checkbox = forwardRef(function Checkbox(
  props: ICheckboxProps & Partial<FieldProps>,
  ref,
) {
  const { form, field, meta, onChange, checked, ...checkboxProps } = props;
  const [checkState, setCheckState] = useState(!!checked);
  const previousCheckState = usePrevious(checkState);
  const checkboxRef = useRef<HTMLInputElement>();

  useEffect(() => {
    // to avoid onChange on initial trigger
    if (previousCheckState !== undefined) {
      if (onChange) onChange(checkState);
      if (form && field) form.setFieldValue(field.name, checkState);
    }
  }, [checkState]);

  useImperativeHandle(ref, () => ({
    check: () => handleCheck(true),
    uncheck: () => handleCheck(false),
  }));

  const handleCheck = (checkedState: boolean) => setCheckState(checkedState);

  return (
    <div className="CheckboxContainer">
      <input
        tabIndex={0}
        className="CheckboxInput"
        ref={checkboxRef as LegacyRef<HTMLInputElement>}
        type="checkbox"
        checked={checkState}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleCheck(e.target.checked)
        }
        {...checkboxProps}
      />
      <Icon
        className="Checkbox"
        size="100%"
        icon={checkState ? <CheckedCellIcon /> : <UncheckedCellIcon />}
      />
    </div>
  );
});

export default Checkbox;
