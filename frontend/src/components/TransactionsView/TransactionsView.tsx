import Loader from '@base/Loader';
import { useTransactionsRepository } from '@repos';
import { ITransaction } from '@shared/interfaces';
import { useStore } from '@store';
import { useObservableState } from 'observable-hooks';
import { useEffect, useState } from 'react';
import './TransactionsView.scss';

function TransactionsView() {
  const { getTransactions } = useTransactionsRepository();
  const { transactionsState$ } = useStore();
  const { loading } = useObservableState(transactionsState$);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);

  useEffect(() => {
    getTransactions().then((data) => data?.length && setTransactions(data));
  }, []);

  const renderTransactionItem = (transaction: ITransaction) => {
    return (
      <div className="TransactionItem">
        <span>{transaction.name}</span>
        <span>{transaction.description}</span>
        <span>{transaction.amount}</span>
        <span>{transaction.category}</span>
        <span>{transaction.paymaster}</span>
      </div>
    );
  };

  const renderTransactionList = () => {
    return (
      <div className="TransactionListContainer">
        {transactions.map(renderTransactionItem)}
      </div>
    );
  };
  return (
    <div className="TransactionsViewContainer">
      {loading && <Loader />}
      {renderTransactionList()}
    </div>
  );
}

export default TransactionsView;
