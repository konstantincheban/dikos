import AccountCard from '@components/AccountCard/AccountCard';
import CreateAccountCard from '@components/AccountCard/CreateAccountCard';
import { useAccountsRepository } from '@repos';
import { CreateAccountRequest } from '@shared/interfaces';
import { useStore } from '@store';
import { useObservableState } from 'observable-hooks';
import { createRef } from 'react';
import { useModalAPI } from 'src/helpers/modalAPI/modalAPI';
import AccountForm from './AccountForm/AccountForm';
import './AccountsView.scss';

function AccountsView() {
  const { modalRef } = useModalAPI();
  const { createAccount } = useAccountsRepository();
  const { accountsState$ } = useStore();
  const { accounts, error } = useObservableState(accountsState$);

  const accountFormRef = createRef<any>();

  const handleCreateAccount = (values: CreateAccountRequest) => {
    createAccount(values).then(() => {
      if (!error) modalRef.current?.close();
    });
  };

  const validateForm = (validState: boolean) => {
    modalRef.current?.updateActionsState([
      {
        id: 'createAccount',
        disabled: !validState,
      },
    ]);
  };

  const handleOpenCreateAccountModal = () => {
    modalRef.current?.open({
      options: {
        title: 'Create Account',
      },
      renderer: (
        <AccountForm
          ref={accountFormRef}
          type="create"
          onSubmitForm={handleCreateAccount}
          validateForm={validateForm}
        />
      ),
      actions: [
        {
          id: 'createAccount',
          label: 'Create',
          disabled: true,
          handler: () => {
            const formData = accountFormRef?.current?.getFormData();
            handleCreateAccount(formData as CreateAccountRequest);
          },
        },
      ],
    });
  };
  return (
    <div className="AccountsViewContainer">
      {accounts.map((account) => (
        <AccountCard key={account._id} {...account} />
      ))}
      <CreateAccountCard onClick={handleOpenCreateAccountModal} />
    </div>
  );
}

export default AccountsView;
