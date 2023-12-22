import { RouteObject, Outlet } from 'react-router-dom';
import { RouteMiddleware } from '@base/RouteMiddleware';
import MainView from '@components/MainView/MainView';
import Authentication from '@components/Authentication/Authentication';
import { IState } from 'src/helpers/observables/utils';
import { AuthState } from '@observables';
import TransactionsView from '@components/TransactionsView/TransactionsView';
import Layout from '@components/Layout/Layout';
import PageNotFound from '@components/PageNotFound/PageNotFound';
import StatisticsView from '@components/StatisticsView/StatisticsView';
import AnalyticsView from '@components/AnalyticsView/AnalyticsView';

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
    element: <RouteMiddleware authState={authState} redirectUrl="/login" />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            path: '/',
            element: <MainView />,
          },
          {
            path: '/accounts',
            element: <MainView currentView="accounts" />,
          },
          {
            path: '/budget',
            element: <MainView currentView="budget" />,
          },
          {
            path: '/transactions',
            element: <TransactionsView />,
          },
          {
            path: '/statistics',
            element: <StatisticsView />,
          },
          {
            path: '/analytics',
            element: <AnalyticsView />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <PageNotFound />,
  },
];
