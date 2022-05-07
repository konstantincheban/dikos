import React from 'react';
import { useNavigate, useRoutes } from 'react-router-dom';
import { getRouterConfig } from '@shared/routerConfig';
import { IState } from 'src/helpers/observables/utils';
import { AuthState } from '@observables';

interface IRouterProps {
  children?: React.ReactNode | React.ReactNode[];
  authState: IState<AuthState>;
}

export const Router = ({ children, authState }: IRouterProps) => {
  const routes = getRouterConfig(authState);
  const Routes = useRoutes(routes);

  return (
    <>
      {Routes}
      {children}
    </>
  );
};
