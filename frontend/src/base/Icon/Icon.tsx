import { classMap } from '@shared/utils';
import { IPropsIcon } from './Icon.types';
import './Icon.scss';

function Icon(props: IPropsIcon) {
  const defaultContainerSize = 24;
  const defaultViewBoxSize = 16;
  const { icon, size, viewBox, className } = props;
  return (
    <div
      className={classMap(
        { [className as string]: !!className },
        'IconContainer',
      )}
      style={{
        height: size ?? defaultContainerSize,
        width: size ?? defaultContainerSize,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${viewBox ?? defaultViewBoxSize} ${
          viewBox ?? defaultViewBoxSize
        }`}
        fill="transparent"
      >
        {icon}
      </svg>
    </div>
  );
}

export default Icon;
