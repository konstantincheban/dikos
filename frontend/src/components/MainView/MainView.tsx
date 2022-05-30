import { IMainViewProps } from './MainView.types';
import Tabs, { ITab } from '@base/Tabs';
import AccountsView from '@components/AccountsView/AccountsView';
import SummaryView from '@components/SummaryView/SummaryView';
import BudgetView from '@components/BudgetView/BudgetView';
import './MainView.scss';

function MainView(props: IMainViewProps) {
  const { currentView } = props;
  const tabs: ITab[] = [
    {
      name: 'Summary',
      path: '/',
    },
    {
      name: 'Accounts',
      path: '/accounts',
    },
    {
      name: 'Budgeting',
      path: '/budget',
    },
  ];

  const renderContent = (currentView?: string) => {
    if (currentView === 'accounts') return <AccountsView />;
    if (currentView === 'budget') return <BudgetView />;
    return <SummaryView />;
  };

  return (
    <div className="MainViewContainer">
      <Tabs currentTab={currentView} tabs={tabs} />
      {renderContent(currentView)}
    </div>
  );
}

export default MainView;
