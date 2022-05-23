import Icon from '@base/Icon';
import { CloseIcon, EditIcon, ShoppingCategoryIcon } from '@base/Icon/IconSet';
import Loader from '@base/Loader';
import Undo from '@base/Undo';
import { useTransactionsRepository } from '@repos';
import { UNDO_DELAY } from '@shared/constants';
import { ITransaction } from '@shared/interfaces';
import { classMap, formatDate } from '@shared/utils';
import { useStore } from '@store';
import { useObservableState } from 'observable-hooks';
import { createRef, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useModalAPI } from 'src/helpers/modalAPI/modalAPI';
import TransactionForm from './TransactionForm/TransactionForm';
import { TransactionFormData } from './TransactionForm/TransactionForm.types';
import './TransactionsView.scss';

function TransactionsView() {
  const { getTransactions, editTransaction, deleteTransaction } =
    useTransactionsRepository();
  const { transactionsState$, accountsState$ } = useStore();
  const {
    loading,
    isUpToDate,
    error: transactionErrors,
  } = useObservableState(transactionsState$);
  const { accounts } = useObservableState(accountsState$);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [undoEntries, setUndoEntries] = useState<string[]>([]);

  const { modalRef } = useModalAPI();

  const transactionModalRef = createRef<any>();

  useEffect(() => {
    getTransactions().then((data) => data?.length && setTransactions(data));
  }, []);

  useEffect(() => {
    !isUpToDate &&
      getTransactions().then((data) => data?.length && setTransactions(data));
  }, [isUpToDate]);

  const handleEditTransaction = (
    values: TransactionFormData,
    transactionId: string,
  ) => {
    editTransaction(values, transactionId).then(() => {
      if (!transactionErrors) modalRef.current?.close();
    });
  };

  const handleDeleteTransaction = (id: string) => {
    deleteTransaction(id).then(() => {
      if (!transactionErrors) modalRef.current?.close();
    });
  };

  const handleValidateTransactionForm = (validState: boolean) => {
    modalRef.current?.updateActionsState([
      {
        id: 'editTransaction',
        disabled: !validState,
      },
    ]);
  };

  const handleOpenEditTransactionModal = (transactionId: string) => {
    const transactionData = transactions.find(
      (item) => item._id === transactionId,
    ) as ITransaction;
    modalRef.current?.open({
      options: {
        title: 'Edit Transaction',
      },
      renderer: (
        <TransactionForm
          ref={transactionModalRef}
          type="edit"
          data={transactionData}
          onSubmitForm={(values) =>
            handleEditTransaction(values, transactionId)
          }
          validateForm={handleValidateTransactionForm}
        />
      ),
      actions: [
        {
          id: 'editTransaction',
          label: 'Save',
          handler: () => {
            const formData = transactionModalRef?.current?.getFormData();
            handleEditTransaction(formData, transactionId);
          },
        },
      ],
    });
  };

  const handleDeleteTransactionAction = (transactionId: string) => {
    const updatedEntries = [...undoEntries, transactionId];
    setUndoEntries(updatedEntries);
    toast(
      <Undo
        onUndo={() =>
          setUndoEntries(undoEntries.filter((item) => item !== transactionId))
        }
      />,
      {
        // hook will be called when the component unmount
        onClose: () => {
          if (updatedEntries.find((item) => item === transactionId))
            handleDeleteTransaction(transactionId);
        },
        hideProgressBar: false,
        autoClose: UNDO_DELAY,
        type: toast.TYPE.INFO,
      },
    );
  };

  const renderTransactionItem = (transaction: ITransaction) => {
    const {
      _id,
      name,
      description,
      paymaster,
      date,
      amount,
      currency,
      accountID,
    } = transaction;
    const associatedAccountName = accounts.find(
      (account) => account._id === accountID,
    )?.name;
    return (
      <div
        key={`${name}_${amount}`}
        className={classMap(
          {
            removing: !!undoEntries.find((item) => item === _id),
          },
          'TransactionItem',
        )}
      >
        <div className="Block">
          <div
            className={classMap(
              { income: amount > 0, outcome: amount < 0 },
              'TransactionCategory Block',
            )}
          >
            <Icon size={25} icon={<ShoppingCategoryIcon />} />
          </div>
        </div>
        <div className="TransactionName Block">
          <span>{name}</span>
          <span className="description">{description}</span>
        </div>
        <div className="Block">
          <span>{`${amount} ${currency}`}</span>
        </div>
        <div className="Block">
          <span>{associatedAccountName}</span>
        </div>
        <div className="Block">{formatDate(date)}</div>
        <div className="Block">{paymaster}</div>
        <div className="TransactionActions Block">
          <button onClick={() => handleOpenEditTransactionModal(_id)}>
            <Icon size={13} icon={<EditIcon />} />
          </button>
          <button onClick={() => handleDeleteTransactionAction(_id)}>
            <Icon size={17} icon={<CloseIcon />} />
          </button>
        </div>
      </div>
    );
  };

  const renderTransactionList = () => {
    const headerConfig = [
      'Category',
      'Name & Description',
      'Amount & Currency',
      'Associated Account',
      'Date',
      'Paymaster',
      'Actions',
    ];
    return (
      <div className="TransactionListContainer">
        <div className="TransactionListHeader">
          {headerConfig.map((item) => (
            <div key={item} className="Block">
              <span title={item}>{item}</span>
            </div>
          ))}
        </div>
        {transactions.map(renderTransactionItem)}
      </div>
    );
  };
  return (
    <div className="TransactionsViewContainer">
      <div className="TransactionViewTitle">Transactions</div>
      {loading && <Loader />}
      {renderTransactionList()}
    </div>
  );
}

export default TransactionsView;
