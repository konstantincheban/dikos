import { ITabsProps } from './Tabs.types';
import { NavLink } from 'react-router-dom';
import './Tabs.scss';
import { classMap } from '@shared/utils';

function Tabs(props: ITabsProps) {
  const { tabs } = props;
  return (
    <div className="TabsContainer">
      {tabs.map(({ path, name, disabled }) => (
        <NavLink
          key={`${path}_${name}`}
          className={classMap({ disabled: !!disabled }, 'TabItem')}
          to={path}
        >
          <span className="TabItemLabel">{name}</span>
        </NavLink>
      ))}
    </div>
  );
}

export default Tabs;
