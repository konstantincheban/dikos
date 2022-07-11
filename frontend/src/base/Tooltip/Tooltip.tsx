import { createRef, PropsWithChildren, useEffect } from 'react';
import { ITooltipProps } from './Tooltip.types';
import './Tooltip.scss';
import { useTooltip } from './TooltipProvider';

const DEFAULT_DELAY = 100;

const Tooltip = (props: PropsWithChildren<ITooltipProps>) => {
  let timeout: ReturnType<typeof setTimeout>;
  const tooltipWrapperRef = createRef<HTMLDivElement>();
  const { tooltipRef } = useTooltip();

  // hide tooltip before unmount
  useEffect(() => {
    return () => tooltipRef.current?.hide();
  });

  const showTip = () => {
    timeout = setTimeout(() => {
      tooltipRef.current?.show(props, tooltipWrapperRef);
    }, props.delay || DEFAULT_DELAY);
  };

  const hideTip = () => {
    clearInterval(timeout);
    tooltipRef.current?.hide();
  };

  return (
    <div
      ref={tooltipWrapperRef}
      className="Tooltip-Wrapper"
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
    >
      {/* Wrapping */}
      {props.children}
    </div>
  );
};

export default Tooltip;
