import Icon from '@base/Icon';
import {
  IDateSummaryWidgetConfig,
  ISummaryWidgetConfig,
  IUserMenuProps,
} from './UserMenu.types';
import './UserMenu.scss';
import { useState } from 'react';
import { immutableMove, classMap } from '@shared/utils';
import Search from '@base/Search';
import {
  NotificationIcon,
  UserIcon,
  ArrowLeftIcon,
  ArrowLeftSecondIcon,
  CalendarPlusIcon,
  CalendarCheckIcon,
  CalendarMonthIcon,
  PlusIcon,
} from '@base/Icon/IconSet';
import Button from '@base/Button';
import AccountCard from '@components/AccountCard/AccountCard';
import Card from '@base/Card';

function UserMenu(props: IUserMenuProps) {
  const accountsDefault = [
    {
      name: 'Default',
      description: 'Default Account',
      type: 'default',
      currency: '980',
      ballance: 3000,
    },
    {
      name: 'Silpo',
      description: 'Silpo Account',
      type: 'silpo',
      currency: '980',
      ballance: 6000,
    },
    {
      name: 'Resort',
      description: 'Resort Account',
      type: 'custom',
      currency: '980',
      ballance: 5000,
    },
    {
      name: 'Create new account',
      description: 'Create new accounts',
      type: 'create',
      currency: '',
      ballance: 0,
    },
  ];

  const summaryConfig: ISummaryWidgetConfig[] = [
    {
      name: 'Income',
      amount: 460.0,
      currency: '980',
    },
    {
      name: 'Outcome',
      amount: 900.0,
      currency: '980',
    },
  ];

  const dateSummaryConfig: IDateSummaryWidgetConfig[] = [
    {
      name: 'Day',
      amount: 30.0,
      currency: '980',
      percentage: 10,
      icon: <CalendarPlusIcon />,
    },
    {
      name: 'Week',
      amount: 200.0,
      currency: '980',
      percentage: -10,
      icon: <CalendarCheckIcon />,
    },
    {
      name: 'Month',
      amount: 600.0,
      currency: '980',
      percentage: -30,
      icon: <CalendarMonthIcon />,
    },
  ];

  const [collapsedMenu, setCollapsed] = useState(true);
  const [accounts, setAccounts] = useState(accountsDefault);

  const handleExpandMenu = () => {
    setCollapsed(false);
  };
  const handleCollapseMenu = () => {
    setCollapsed(true);
  };

  const handleSearch = (value: string) => {
    // console.log('HANDLE SEARCH', value);
  };

  const handleCreateNewTransaction = () => {
    console.log('CREATE NEW TRANSACTION');
  };

  const handleReorder = (index: number) => {
    if (index) {
      const reorderedAccounts = immutableMove(accounts, index, 0);
      setAccounts(reorderedAccounts);
    }
  };

  const renderSectionTitle = (title: string) => {
    return (
      <div className="SectionTitle">
        <span className="Title">{title}</span>
        <Icon icon={<ArrowLeftIcon />} />
      </div>
    );
  };

  const renderSummaryWidget = (
    widgetConfig: ISummaryWidgetConfig,
    key: number,
  ) => {
    const { name, amount, currency } = widgetConfig;
    return (
      <div key={key} className="SummaryWidgetContainer">
        <div className={`Graphic ${name}`}>
          <Icon icon={<ArrowLeftSecondIcon />} />
        </div>
        <div className="Info">
          <span className="InfoTitle">{name}</span>
          <span className="InfoAmount">${amount}</span>
        </div>
      </div>
    );
  };

  const renderDateSummaryWidget = (
    widgetConfig: IDateSummaryWidgetConfig,
    key: number,
  ) => {
    const { name, amount, currency, percentage, icon } = widgetConfig;
    return (
      <div key={key} className="DateSummaryWidgetContainer">
        <div className="Badge">
          <Icon icon={icon} />
        </div>
        <div className="Info">
          <span className="InfoTitle">This {name}</span>
          <span className="InfoAmount">${amount}</span>
          <span className="InfoPercentage">{percentage}%</span>
        </div>
      </div>
    );
  };

  return (
    <div
      className={classMap({ collapsed: collapsedMenu }, 'UserMenuContainer')}
      onMouseEnter={handleExpandMenu}
      onMouseLeave={handleCollapseMenu}
    >
      <div className="UtilsHeader">
        <Search onChange={handleSearch} />
        <Icon icon={<NotificationIcon />} />
        <Icon icon={<UserIcon />} />
      </div>
      <div className="AccountsSection">
        {renderSectionTitle('Your Accounts')}
        {accounts.map((accountItem, key) =>
          accountItem.type !== 'create' ? (
            <AccountCard
              className={`CardPosition-${key}`}
              key={`${accountItem.name}_${key}`}
              onClick={() => handleReorder(key)}
              {...accountItem}
            />
          ) : (
            <Card
              className={`CreationCart CardPosition-${key}`}
              key={`${accountItem.name}_${key}`}
              onClick={() => handleReorder(key)}
            >
              <span>{accountItem.name}</span>
              <Icon size={45} icon={<PlusIcon />} />
            </Card>
          ),
        )}
      </div>
      <div className="AccountSummary">
        {renderSectionTitle('Account Summary')}
        <div className="SummaryContainer">
          {summaryConfig.map((config, key) => renderSummaryWidget(config, key))}
        </div>
        <div className="DateSummaryContainer">
          {dateSummaryConfig.map((config, key) =>
            renderDateSummaryWidget(config, key),
          )}
        </div>
      </div>
      <div className="AccountActions">
        <Button onClick={handleCreateNewTransaction}>
          <span>Create Transaction</span>
        </Button>
      </div>
    </div>
  );
}

export default UserMenu;
