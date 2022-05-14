import { IMainViewProps } from './MainView.types';
import './MainView.scss';
import Tabs, { ITab } from '@base/Tabs';
import AccountsView from '@components/AccountsView/AccountsView';
import SummaryView from '@components/SummaryView/SummaryView';

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
      name: 'Coming Soon',
      path: '/comingsoon',
      disabled: true,
    },
  ];

  const renderContent = (currentView?: string) => {
    if (currentView === 'accounts') return <AccountsView />;
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
