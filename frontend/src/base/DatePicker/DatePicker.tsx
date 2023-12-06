import { useEffect, useState } from 'react';
import { default as ReactDatePicker } from 'react-datepicker';
import { FieldProps } from 'formik';
import Input from '@base/Input';
import { IDatePickerProps } from './DatePicker.types';
import './DatePicker.scss';
import 'react-datepicker/dist/react-datepicker.css';

function DatePicker(props: IDatePickerProps & Partial<FieldProps>) {
  const { showTime, disabled, placeholder, field, form } = props;
  const [value, setValue] = useState('');
  // TODO, check Formik behavior on how it pass default values to controls
  const [date, setDate] = useState(new Date(field?.value) ?? new Date());

  useEffect(() => {
    // Field Mode
    setToFieldValue(value);
  }, [value]);

  useEffect(() => {
    setValue(date.toISOString());
  }, [date]);

  const setToFieldValue = (value: string | null | undefined) => {
    if (form && field && value) {
      form.setFieldValue(field.name, value);
    }
  };

  return (
    <div className="DatePickerContainer">
      <ReactDatePicker
        timeInputLabel="Time:"
        dateFormat="dd/MM/yyyy h:mm aa"
        calendarClassName="calendarContainerClassName"
        placeholderText={placeholder ?? 'Select date'}
        dayClassName={() => 'calendarDayClassName'}
        showPopperArrow={false}
        closeOnScroll={true}
        disabled={disabled}
        showTimeSelect={showTime ?? true}
        selected={date}
        customInput={<Input />}
        onChange={(date) => date && setDate(date)}
      />
    </div>
  );
}

export default DatePicker;
