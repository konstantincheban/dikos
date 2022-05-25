import React, { createContext, createRef, useContext } from 'react';
import { ITooltipProvider } from './Tooltip.types';
import TooltipContent from './TooltipContent';

const TooltipContext = createContext({
  tooltipRef: createRef<ITooltipProvider>(),
});

export const useTooltip = () => useContext(TooltipContext);

export const TooltipProvider = ({
  children,
}: React.PropsWithChildren<unknown>) => {
  const tooltipRef = createRef<ITooltipProvider>();

  return (
    <TooltipContext.Provider
      value={{
        tooltipRef,
      }}
    >
      <TooltipContent ref={tooltipRef} />
      {children}
    </TooltipContext.Provider>
  );
};
