import NavigationMenu from '@components/NavigationMenu/NavigationMenu';
import UserMenu from '@components/UserMenu/UserMenu';
import {
  useAccountsRepository,
  useAuthRepository,
  useTransactionsRepository,
  useUserRepository,
} from '@repos';
import { UNDO_DELAY } from '@shared/constants';
import { navigationMenuConfig } from '@shared/navigationMenuConfig';
import { setGlobalCSSVariable } from '@shared/utils';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import './Layout.scss';

function Layout() {
  const accountsRepo = useAccountsRepository();
  const authRepo = useAuthRepository();
  const userRepo = useUserRepository();
  const transactionsRepo = useTransactionsRepository();

  useEffect(() => {
    authRepo
      .getUserData()
      .then((data) => data && userRepo.getBudgetData(data.budgetID));
    accountsRepo.getAccounts();
    transactionsRepo.getProposedCategories();
    transactionsRepo.getTransactionsCount();
    setGlobalCSSVariable('--undo-animation-duration', `${UNDO_DELAY + 3000}ms`);
  }, []);

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
