import AccountCard from '@components/AccountCard/AccountCard';
import CreateAccountCard from '@components/AccountCard/CreateAccountCard';
import { useStore } from '@store';
import { useObservableState } from 'observable-hooks';
import './AccountsView.scss';

function AccountsView() {
  const { accountsState$ } = useStore();
  const { accounts } = useObservableState(accountsState$);
  return (
    <div className="AccountsViewContainer">
      {accounts.map((account) => (
        <AccountCard key={account._id} {...account} />
      ))}
      <CreateAccountCard />
    </div>
  );
}

export default AccountsView;
