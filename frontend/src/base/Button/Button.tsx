import { IButtonProps } from './Button.types';
import './Button.scss';
import { classMap } from '@shared/utils';

function Button({
  children,
  secondary,
  disruptive,
  className,
  ...rest
}: IButtonProps) {
  return (
    <div className="ButtonContainer">
      <button
        className={classMap(
          {
            [className as string]: !!className,
            secondary: !!secondary,
            disruptive: !!disruptive,
          },
          '',
        )}
        {...rest}
      >
        {children}
      </button>
    </div>
  );
}

export default Button;
