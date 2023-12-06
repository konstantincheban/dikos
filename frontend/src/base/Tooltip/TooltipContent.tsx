import {
  createRef,
  forwardRef,
  RefObject,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { Directions, ITooltipProps, Sizes } from './Tooltip.types';
import { classMap } from '@shared/utils';
import './Tooltip.scss';

const DEFAULT_MARGIN = 10;
const DEFAULT_DIRECTION: Directions = 'right';
const DEFAULT_SIZE: Sizes = 'medium';

const TooltipContent = forwardRef(function TooltipContent(props, ref) {
  const [active, setActive] = useState(false);
  const [content, setContent] = useState<ITooltipProps['content']>('');
  const [wrapperRef, setWrapperRef] = useState<RefObject<HTMLDivElement>>();
  const [direction, setDirection] = useState<Directions>(DEFAULT_DIRECTION);
  const [size, setSize] = useState<Sizes>(DEFAULT_SIZE);
  const [coordinates, setCoordinates] = useState({
    x: 0,
    y: 0,
  });

  const tooltipContentRef = createRef<HTMLDivElement>();

  useImperativeHandle(ref, () => ({
    show: (options: ITooltipProps, wrapperRef: RefObject<HTMLDivElement>) =>
      showTooltip(options, wrapperRef),
    hide: () => setActive(false),
    updateContent: (content: ITooltipProps['content']) => setContent(content),
  }));

  const showTooltip = (
    options: ITooltipProps,
    wrapperRef: RefObject<HTMLDivElement>,
  ) => {
    setDirection(options.direction ?? DEFAULT_DIRECTION);
    setSize(options.size ?? DEFAULT_SIZE);
    setWrapperRef(wrapperRef);
    setContent(options.content);
    setActive(true);
  };

  const isInViewPort = (wrapperRect: DOMRect, direction: Directions) => {
    const viewport = {
      height: window.innerHeight + scrollY,
      width: window.innerWidth + scrollY,
    };
    const contentRect =
      tooltipContentRef.current?.getBoundingClientRect() as DOMRect;
    if (wrapperRect) {
      if (
        direction === 'top' &&
        wrapperRect.top - contentRect.height - DEFAULT_MARGIN < 0
      ) {
        return false;
      }
      if (
        direction === 'bottom' &&
        wrapperRect.bottom + contentRect.height + DEFAULT_MARGIN > viewport.height
      ) {
        return false;
      }
      if (
        direction === 'left' &&
        wrapperRect.left - contentRect.width - DEFAULT_MARGIN < 0
      ) {
        return false;
      }
      if (
        direction === 'right' &&
        wrapperRect.right + contentRect.width + DEFAULT_MARGIN > viewport.width
      ) {
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    if (active) {
      const directionCalc = direction || DEFAULT_DIRECTION;
      let xDirection = 'right' as Directions;
      let yDirection = 'top' as Directions;
      const wrapperRect =
        wrapperRef?.current?.getBoundingClientRect() as DOMRect;

      if (directionCalc === 'top') {
        if (isInViewPort(wrapperRect, directionCalc))
          yDirection = directionCalc;
        else {
          yDirection = 'bottom';
          setDirection('bottom');
        }
      }
      if (directionCalc === 'bottom') {
        if (isInViewPort(wrapperRect, directionCalc))
          yDirection = directionCalc;
        else {
          yDirection = 'top';
          setDirection('top');
        }
      }
      if (directionCalc === 'left') {
        if (isInViewPort(wrapperRect, directionCalc))
          xDirection = directionCalc;
        else {
          xDirection = 'right';
          setDirection('right');
        }
      }
      if (directionCalc === 'right') {
        if (isInViewPort(wrapperRect, directionCalc))
          xDirection = directionCalc;
        else {
          xDirection = 'left';
          setDirection('left');
        }
      }

      setCoordinates({
        x: wrapperRect[xDirection],
        y: wrapperRect[yDirection],
      });
    }
  }, [active]);

  return (
    <div
      ref={tooltipContentRef}
      style={{ left: coordinates.x, top: coordinates.y }}
      className={classMap(
        {
          [direction as string]: !!direction,
          [size as string]: !!size,
          visible: active,
          hidden: !active,
        },
        'Tooltip-Tip',
      )}
    >
      {/* Content */}
      {content}
    </div>
  );
});

export default TooltipContent;
