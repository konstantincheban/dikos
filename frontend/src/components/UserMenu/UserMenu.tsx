import Icon from '@base/Icon';
import {
  IDateSummaryWidgetConfig,
  ISummaryWidgetConfig,
} from './UserMenu.types';
import './UserMenu.scss';
import { createRef, useEffect, useState } from 'react';
import { immutableMove, classMap } from '@shared/utils';
import Search from '@base/Search';
import {
  NotificationIcon,
  UserIcon,
  ArrowRightIcon,
  ArrowRightSecondIcon,
  CalendarPlusIcon,
  CalendarCheckIcon,
  CalendarMonthIcon,
} from '@base/Icon/IconSet';
import Button from '@base/Button';
import AccountCard from '@components/AccountCard/AccountCard';
import { useStore } from '@store';
import { useObservableState } from 'observable-hooks';
import CreateAccountCard from '@components/AccountCard/CreateAccountCard';
import { useModalAPI } from 'src/helpers/modalAPI/modalAPI';
import TransactionForm from '@components/TransactionsView/TransactionForm/TransactionForm';
import { ITransactionFormProps } from '@components/TransactionsView/TransactionForm/TransactionForm.types';
import { useAccountsRepository, useTransactionsRepository } from '@repos';
import { defaultData } from '@components/TransactionsView/TransactionForm/TransactionFormConfigurations';
import {
  AccountSummaryData,
  CreateAccountRequest,
  CreateTransactionRequest,
} from '@shared/interfaces';
import { AccountFormData } from '@components/AccountsView/AccountForm/AccountForm.types';
import AccountForm from '@components/AccountsView/AccountForm/AccountForm';
import Tooltip from '@base/Tooltip';

function UserMenu() {
  const summaryConfigDefault: ISummaryWidgetConfig[] = [
    {
      ref: 'income',
      name: 'Income',
      amount: 0,
      currency: 'UAH',
    },
    {
      ref: 'outcome',
      name: 'Outcome',
      amount: 0,
      currency: 'UAH',
    },
  ];

  const dateSummaryConfigDefault: IDateSummaryWidgetConfig[] = [
    {
      ref: 'byDay',
      name: 'Daily Outcome',
      amount: 0,
      percentage: '0%',
      currency: 'UAH',
      icon: <CalendarPlusIcon />,
    },
    {
      ref: 'byWeek',
      name: 'Weekly Outcome',
      amount: 0,
      percentage: '0%',
      currency: 'UAH',
      icon: <CalendarCheckIcon />,
    },
    {
      ref: 'byMonth',
      name: 'Monthly Outcome',
      amount: 0,
      percentage: '0%',
      currency: 'UAH',
      icon: <CalendarMonthIcon />,
    },
  ];

  const { authState$, accountsState$, transactionsState$ } = useStore();
  const { accounts, error: accountsErrors } =
    useObservableState(accountsState$);
  const { createAccount, getAccountSummary } = useAccountsRepository();
  const { error: transactionErrors } = useObservableState(transactionsState$);
  const { createTransaction } = useTransactionsRepository();
  const { username } = useObservableState(authState$);

  const [collapsedMenu, setCollapsed] = useState(true);
  const [accountsList, setAccounts] = useState(accounts);
  const [currentAccount, setCurrentAccount] = useState(accounts[0]);
  const [summaryConfig, setSummaryConfig] = useState(summaryConfigDefault);
  const [dateSummaryConfig, setDateSummaryConfig] = useState(
    dateSummaryConfigDefault,
  );

  const { modalRef } = useModalAPI();

  const transactionModalRef = createRef<any>();
  const accountModalRef = createRef<any>();

  useEffect(() => {
    setAccounts([
      ...accounts.slice(0, 3),
      {
        _id: '12345',
        name: 'Create new Account',
        description: 'Create new Account',
        type: 'create',
        ballance: 0,
        currency: 'UAH',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
    if (accounts?.length) {
      getAccountSummary(accounts[0]._id).then(
        (data) => data && setSummaryDataToConfig(data),
      );
    }
  }, [accounts]);

  useEffect(() => {
    if (currentAccount && currentAccount.type !== 'create') {
      getAccountSummary(currentAccount._id).then(
        (data) => data && setSummaryDataToConfig(data),
      );
    }
  }, [currentAccount]);

  const setSummaryDataToConfig = (data: AccountSummaryData) => {
    const updatedSummaryConfig = summaryConfig.map((configItem) => ({
      ...configItem,
      amount: data[configItem.ref] ?? 0,
    }));
    const updatedDateSummaryConfig = dateSummaryConfig.map((configItem) => ({
      ...configItem,
      amount: data[configItem.ref]?.amount ?? 0,
      percentage: data[configItem.ref]?.percentage ?? '0%',
    }));
    setSummaryConfig(updatedSummaryConfig);
    setDateSummaryConfig(updatedDateSummaryConfig);
  };

  const handleExpandMenu = () => {
    setCollapsed(false);
  };
  const handleCollapseMenu = () => {
    setCollapsed(true);
  };

  const handleSearch = () => {
    // console.log('HANDLE SEARCH', value);
  };

  const handleCreateTransaction = (values: CreateTransactionRequest) => {
    createTransaction(values).then(() => {
      if (!transactionErrors) modalRef.current?.close();
    });
  };

  const handleValidateModalForm = (validState: boolean, actionId: string) => {
    modalRef.current?.updateActionsState([
      {
        id: actionId,
        disabled: !validState,
      },
    ]);
  };

  const handleCreateNewTransaction = () => {
    const associatedAccountID =
      accountsList[0].type !== 'create'
        ? accountsList[0]._id
        : accountsList[1]._id;
    const defaultFormData = {
      ...defaultData,
      accountID: associatedAccountID,
    };
    const accountOptions: ITransactionFormProps['availableAccounts'] =
      accounts.reduce((acc, account) => {
        if (account.type !== 'create') {
          acc?.push({
            value: account._id,
            label: account.name,
          });
        }
        return acc;
      }, [] as ITransactionFormProps['availableAccounts']);
    modalRef.current?.open({
      options: {
        title: 'Create Transaction',
      },
      renderer: (
        <TransactionForm
          ref={transactionModalRef}
          type="create"
          availableAccounts={accountOptions}
          data={defaultFormData}
          onSubmitForm={(values) =>
            handleCreateTransaction(values as CreateTransactionRequest)
          }
          validateForm={(validState: boolean) =>
            handleValidateModalForm(validState, 'createTransaction')
          }
        />
      ),
      actions: [
        {
          id: 'createTransaction',
          label: 'Create',
          handler: () => transactionModalRef?.current?.submitForm(),
        },
      ],
    });
  };

  const handleCreateAccount = (values: CreateAccountRequest) => {
    createAccount(values).then(() => {
      if (!accountsErrors) modalRef.current?.close();
    });
  };

  const handleOpenCreateAccountModal = () => {
    modalRef.current?.open({
      options: {
        title: 'Create Account',
      },
      renderer: (
        <AccountForm
          ref={accountModalRef}
          type="create"
          onSubmitForm={(values: AccountFormData) =>
            handleCreateAccount(values as CreateAccountRequest)
          }
          validateForm={(validState: boolean) =>
            handleValidateModalForm(validState, 'createAccount')
          }
        />
      ),
      actions: [
        {
          id: 'createAccount',
          label: 'Create',
          disabled: true,
          handler: () => accountModalRef?.current?.submitForm(),
        },
      ],
    });
  };

  const handleClickOnCreateAccountCard = (index: number) => {
    if (index) handleReorder(index);
    else handleOpenCreateAccountModal();
  };

  const handleReorder = (index: number) => {
    if (index) {
      const reorderedAccounts = immutableMove(accountsList, index, 0);
      setAccounts(reorderedAccounts);
      setCurrentAccount(reorderedAccounts[0]);
    }
  };

  const renderSectionTitle = (title: string) => {
    return (
      <div className="SectionTitle">
        <span className="Title">{title}</span>
        <Icon icon={<ArrowRightIcon />} />
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
          <Icon icon={<ArrowRightSecondIcon />} />
        </div>
        <div className="Info">
          <span className="InfoTitle">{name}</span>
          <span className="InfoAmount">
            {amount} {currency}
          </span>
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
          <span className="InfoTitle">{name}</span>
          <span className="InfoAmount">
            {amount} {currency}
          </span>
          <span
            className={classMap(
              { negative: percentage.includes('-') },
              'InfoPercentage',
            )}
          >
            {percentage}
          </span>
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
        <Tooltip content={username} size="small">
          <Icon icon={<UserIcon />} />
        </Tooltip>
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
              onClick={() => handleClickOnCreateAccountCard(key)}
            />
          ),
        )}
      </div>
      <div className="AccountSummary">
        {currentAccount?.type !== 'create' ? (
          <>
            {renderSectionTitle('Account Summary')}
            <div className="SummaryContainer">
              {summaryConfig.map((config, key) =>
                renderSummaryWidget(config, key),
              )}
            </div>
            <div className="DateSummaryContainer">
              {dateSummaryConfig.map((config, key) =>
                renderDateSummaryWidget(config, key),
              )}
            </div>
          </>
        ) : (
          ''
        )}
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
