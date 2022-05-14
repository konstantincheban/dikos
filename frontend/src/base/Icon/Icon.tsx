import { IPropsIcon } from './Icon.types';

function Icon(props: IPropsIcon) {
  const defaultContainerSize = 24;
  const defaultViewBoxSize = 16;
  const { icon, size, viewBox } = props;
  return (
    <div
      className="IconContainer"
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
