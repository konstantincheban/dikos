import { IButtonProps } from './Button.types';
import './Button.scss';
import { classMap } from '@shared/utils';
import Icon from '@base/Icon';

function Button({
  children,
  secondary,
  disruptive,
  className,
  size,
  icon,
  ...rest
}: IButtonProps) {
  const baseRenderer = () => (
    <button
      className={classMap(
        {
          [className as string]: !!className,
          [size as string]: !!size,
          secondary: !!secondary,
          disruptive: !!disruptive,
        },
        '',
      )}
      {...rest}
    >
      {children}
    </button>
  );

  const iconBasedButtonRenderer = () =>
    icon && (
      <button
        className={classMap(
          {
            [className as string]: !!className,
            [size as string]: !!size,
            disruptive: !!disruptive,
          },
          'IconButton',
        )}
        {...rest}
      >
        <Icon size="100%" icon={icon} />
      </button>
    );

  return (
    <div className="ButtonContainer">
      {icon ? iconBasedButtonRenderer() : baseRenderer()}
    </div>
  );
}

export default Button;
