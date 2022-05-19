import Icon from '@base/Icon';
import {
  IDateSummaryWidgetConfig,
  ISummaryWidgetConfig,
} from './UserMenu.types';
import './UserMenu.scss';
import { useEffect, useState } from 'react';
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
} from '@base/Icon/IconSet';
import Button from '@base/Button';
import AccountCard from '@components/AccountCard/AccountCard';
import { useStore } from '@store';
import { useObservableState } from 'observable-hooks';
import CreateAccountCard from '@components/AccountCard/CreateAccountCard';

function UserMenu() {
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

  const { accountsState$ } = useStore();
  const { accounts } = useObservableState(accountsState$);

  const [collapsedMenu, setCollapsed] = useState(true);
  const [accountsList, setAccounts] = useState(accounts);

  useEffect(() => {
    setAccounts([
      ...accounts.slice(0, 3),
      {
        _id: '12345',
        name: 'Create new Account',
        description: 'Create new Account',
        type: 'create',
        currency: 'UAH',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  }, [accounts]);

  const handleExpandMenu = () => {
    setCollapsed(false);
  };
  const handleCollapseMenu = () => {
    setCollapsed(true);
  };

  const handleSearch = () => {
    // console.log('HANDLE SEARCH', value);
  };

  const handleCreateNewTransaction = () => {
    console.log('CREATE NEW TRANSACTION');
  };

  const handleReorder = (index: number) => {
    if (index) {
      const reorderedAccounts = immutableMove(accountsList, index, 0);
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
    const { name, amount } = widgetConfig;
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
    const { name, amount, percentage, icon } = widgetConfig;
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
        {accountsList.map((accountItem, key) =>
          accountItem.type !== 'create' ? (
            <AccountCard
              className={`CardPosition-${key}`}
              key={`${accountItem.name}_${key}`}
              onClick={() => handleReorder(key)}
              {...accountItem}
            />
          ) : (
            <CreateAccountCard
              key={`${accountItem.name}_${key}`}
              className={`CardPosition-${key}`}
              onClick={() => handleReorder(key)}
            />
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
