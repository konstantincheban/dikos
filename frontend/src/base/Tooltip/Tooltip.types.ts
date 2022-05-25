import { RefObject } from 'react';

export interface ITooltipProps {
  delay?: number;
  direction?: Directions;
  content: string | React.ReactElement;
}

export type Directions = 'top' | 'bottom' | 'left' | 'right';

export interface ITooltipProvider {
  show: (options: ITooltipProps, wrapperRef: RefObject<HTMLDivElement>) => void;
  hide: () => void;
}
