import { RouteObject, Outlet } from 'react-router-dom';
import { RouteMiddleware } from '@base/RouteMiddleware';
import Main from '@components/Main/Main';
import Authentication from '@components/Authentication/Authentication';
import { IState } from 'src/helpers/observables/utils';
import { AuthState } from '@observables';

export const getRouterConfig = (
  authState: IState<AuthState>,
): RouteObject[] => [
  // public routes
  {
    element: <Outlet />,
    children: [
      {
        path: '/login',
        element: <Authentication />,
      },
      {
        path: '/registration',
        element: <Authentication />,
      },
    ],
  },
  // private routes
  {
    path: '/',
    element: <RouteMiddleware authState={authState} redirectUrl="/login" />,
    children: [
      {
        path: '/',
        element: <Main />,
      },
    ],
  },
];
