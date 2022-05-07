import { AuthState } from '@observables';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { IState } from 'src/helpers/observables/utils';

interface IRouteMiddleware {
  redirectUrl: string;
  authState: IState<AuthState>;
}

export const RouteMiddleware = (
  props: IRouteMiddleware,
): React.ReactElement => {
  const { redirectUrl, authState } = props;
  const location = useLocation();

  if (authState.token) return <Outlet />;
  return <Navigate to={redirectUrl} state={{ from: location }} />;
};

export default RouteMiddleware;
