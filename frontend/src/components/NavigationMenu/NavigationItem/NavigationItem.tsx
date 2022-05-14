import Icon from '@base/Icon';
import { NavLink } from 'react-router-dom';
import { INavigationItemConfig } from '@shared/navigationMenuConfig';
import './NavigationItem.scss';

function NavigationItem(props: INavigationItemConfig) {
  const { label, icon, path } = props;
  return (
    <NavLink className="NavigationItem" to={path}>
      <Icon icon={icon} />
      <span className="ItemLabel">{label}</span>
    </NavLink>
  );
}

export default NavigationItem;
