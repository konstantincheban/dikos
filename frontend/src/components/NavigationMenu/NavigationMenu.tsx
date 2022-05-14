import Icon from '@base/Icon';
import { LogoIcon, LogoutIcon } from '@base/Icon/IconSet';
import { useAuthRepository } from '@repos';
import NavigationItem from './NavigationItem/NavigationItem';
import { INavigationMenuProps } from './NavigationMenu.types';
import './NavigationMenu.scss';
import { Link } from 'react-router-dom';

function NavigationMenu(props: INavigationMenuProps) {
  const { config } = props;
  const { logout } = useAuthRepository();
  const handleLogoutClick = () => {
    logout();
  };
  return (
    <div className="NavigationMenuContainer">
      <div className="LogoSection">
        <Link to="/">
          <Icon size={60} icon={<LogoIcon />} />
        </Link>
      </div>
      <div className="NavigationSection">
        <div className="NavigationWrapper">
          {config.map((item, key) => (
            <NavigationItem key={`${key}_${item.path}`} {...item} />
          ))}
        </div>
      </div>
      <div className="LogoutSection">
        <div
          title="Logout"
          className="LogoutButton"
          tabIndex={0}
          onClick={handleLogoutClick}
        >
          <Icon icon={<LogoutIcon />} />
        </div>
      </div>
    </div>
  );
}

export default NavigationMenu;
