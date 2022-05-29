import { RefObject } from 'react';

export interface ITooltipProps {
  delay?: number;
  direction?: Directions;
  size?: Sizes;
  content: string | React.ReactElement;
}

export type Directions = 'top' | 'bottom' | 'left' | 'right';
export type Sizes = 'small' | 'medium' | 'large';

export interface ITooltipProvider {
  show: (options: ITooltipProps, wrapperRef: RefObject<HTMLDivElement>) => void;
  hide: () => void;
}
