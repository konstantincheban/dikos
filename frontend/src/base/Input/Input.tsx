import { IInputProps } from './Input.types';
import './Input.scss';
import { forwardRef, LegacyRef, useImperativeHandle, useRef } from 'react';

const Input = forwardRef(function Input(
  { className, children, value, ...rest }: IInputProps,
  ref,
) {
  const inputRef = useRef<HTMLInputElement>();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef?.current?.focus();
    },
  }));
  return (
    <div className="InputContainer">
      <input
        ref={inputRef as LegacyRef<HTMLInputElement>}
        className={`Input ${className ?? ''}`}
        value={value}
        {...rest}
      />
      {children}
    </div>
  );
});

export default Input;
