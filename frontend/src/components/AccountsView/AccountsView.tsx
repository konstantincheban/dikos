import Loader from '@base/Loader';
import AccountCard from '@components/AccountCard/AccountCard';
import CreateAccountCard from '@components/AccountCard/CreateAccountCard';
import { useAccountsRepository } from '@repos';
import { CreateAccountRequest, EditAccountRequest } from '@shared/interfaces';
import { useStore } from '@store';
import { useObservableState } from 'observable-hooks';
import { createRef } from 'react';
import { useModalAPI } from 'src/helpers/modalAPI/modalAPI';
import AccountForm from './AccountForm/AccountForm';
import { AccountFormData } from './AccountForm/AccountForm.types';
import './AccountsView.scss';
import { AccountActions } from './AccountsView.types';

function AccountsView() {
  const { modalRef } = useModalAPI();
  const { createAccount, editAccount, deleteAccount } = useAccountsRepository();
  const { accountsState$ } = useStore();
  const { accounts, error, loading } = useObservableState(accountsState$);

  const accountFormRef = createRef<any>();

  const defaultAccountActions: AccountActions[] = [
    {
      type: 'edit',
      label: 'Edit Account',
      handler: (id) => {
        handleOpenEditAccountModal(id);
      },
    },
  ];

  const actions: AccountActions[] = [
    {
      type: 'edit',
      label: 'Edit Account',
      handler: (id) => {
        handleOpenEditAccountModal(id);
      },
    },
    {
      type: 'delete',
      label: 'Delete Account',
      handler: (id) => handleOpenDeleteAccountModal(id),
    },
  ];

  const handleCreateAccount = (values: CreateAccountRequest) => {
    createAccount(values).then(() => {
      if (!error) modalRef.current?.close();
    });
  };

  const handleEditAccount = (values: EditAccountRequest, id: string) => {
    editAccount(values, id).then(() => {
      if (!error) modalRef.current?.close();
    });
  };

  const handleDeleteAccount = (id: string) => {
    deleteAccount(id).then(() => {
      if (!error) modalRef.current?.close();
    });
  };

  const validateForm = (validState: boolean) => {
    modalRef.current?.updateActionsState([
      {
        id: 'account',
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
          onSubmitForm={(values: AccountFormData) =>
            handleCreateAccount(values as CreateAccountRequest)
          }
          validateForm={validateForm}
        />
      ),
      actions: [
        {
          id: 'account',
          label: 'Create',
          disabled: true,
          handler: () => accountFormRef?.current?.submitForm(),
        },
      ],
    });
  };

  const handleOpenEditAccountModal = (accountId?: string) => {
    const accountData = accounts.find((item) => item._id === accountId);
    modalRef.current?.open({
      options: {
        title: 'Edit Account',
      },
      renderer: (
        <AccountForm
          ref={accountFormRef}
          type="edit"
          data={{
            name: accountData?.name ?? '',
            description: accountData?.description ?? '',
          }}
          onSubmitForm={(values: EditAccountRequest) => {
            handleEditAccount(values, accountId as string);
          }}
          validateForm={validateForm}
        />
      ),
      actions: [
        {
          id: 'account',
          label: 'Save',
          disabled: true,
          handler: () => accountFormRef?.current?.submitForm(),
        },
      ],
    });
  };

  const handleOpenDeleteAccountModal = (accountId: string) => {
    modalRef.current?.open({
      options: {
        title: 'Delete Account',
      },
      renderer: (
        <span>
          {`Are you sure that you want to delete this account?
          All transactions related to this account will be deleted`}
        </span>
      ),
      actions: [
        {
          id: 'account',
          label: 'Delete',
          disabled: false,
          disruptive: true,
          handler: () => {
            handleDeleteAccount(accountId);
          },
        },
      ],
    });
  };

  return (
    <div className="AccountsViewContainer">
      {loading && <Loader />}
      {accounts.map((account) => (
        <AccountCard
          key={account._id}
          actions={account.type === 'default' ? defaultAccountActions : actions}
          {...account}
        />
      ))}
      <CreateAccountCard onClick={handleOpenCreateAccountModal} />
    </div>
  );
}

export default AccountsView;
