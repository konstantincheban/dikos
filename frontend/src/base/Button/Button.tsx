import { IButtonProps } from './Button.types';
import './Button.scss';

function Button({ children, ...rest }: IButtonProps) {
  return (
    <div className="ButtonContainer">
      <button {...rest}>{children}</button>
    </div>
  );
}

export default Button;
