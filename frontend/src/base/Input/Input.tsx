import { IInputProps } from './Input.types';
import './Input.scss';

function Input({ className, ...rest }: IInputProps) {
  return (
    <div className="InputContainer">
      <input className={`Input ${className ?? ''}`} {...rest} />
    </div>
  );
}

export default Input;
