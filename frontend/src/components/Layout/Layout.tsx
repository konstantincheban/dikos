import { LogoutIcon } from '@base/Icon/IconSet';
import NavigationMenu from '@components/NavigationMenu/NavigationMenu';
import UserMenu from '@components/UserMenu/UserMenu';
import { navigationMenuConfig } from '@shared/navigationMenuConfig';
import { Outlet } from 'react-router-dom';
import './Layout.scss';

function Layout() {
  return (
    <div className="LayoutContainer">
      <NavigationMenu config={navigationMenuConfig} />
      <div className="MainContainer">
        <Outlet />
      </div>
      <UserMenu />
    </div>
  );
}

export default Layout;
