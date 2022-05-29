import Icon from '@base/Icon';
import { MinusIcon, PlusIcon } from '@base/Icon/IconSet';
import Loader from '@base/Loader';
import { useTransactionsRepository } from '@repos';
import { ITransaction } from '@shared/interfaces';
import { classMap } from '@shared/utils';
import { useStore } from '@store';
import { useObservableState } from 'observable-hooks';
import { useEffect, useState } from 'react';
import './SummaryView.scss';

function SummaryView() {
  const { transactionsState$ } = useStore();
  const { loading, isUpToDate } = useObservableState(transactionsState$);
  const { getTransactions } = useTransactionsRepository();
  const [recentTransactions, setRecentTransactions] = useState<ITransaction[]>(
    [],
  );

  useEffect(() => {
    fetchRecentTransactions();
  }, []);

  useEffect(() => {
    if (!isUpToDate && !loading) {
      fetchRecentTransactions();
    }
  }, [isUpToDate, loading]);

  const fetchRecentTransactions = () => {
    getTransactions('?top=10&orderby=date desc').then(
      (data) => data && setRecentTransactions(data),
    );
  };

  const renderTransaction = (transaction: ITransaction, index: number) => {
    const { name, description, amount, currency } = transaction;
    const isIncome = amount >= 0;
    const transactionIcon = isIncome ? <PlusIcon /> : <MinusIcon />;
    return (
      <div key={`${name}_${index}`} className="TransactionItemBlock">
        <div
          className={classMap(
            { income: isIncome, outcome: !isIncome },
            'TypeOfTransaction',
          )}
        >
          <Icon size={20} icon={transactionIcon} />
        </div>
        <div className="NameBlock">
          <span>{name}</span>
          <span>{description}</span>
        </div>
        <div className="AmountBlock">
          <span>
            {amount} {currency}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="SummaryViewContainer">
      {loading && <Loader />}
      <div className="RecentTransactionsBlock">
        <div className="BlockTitle">Recent Transactions</div>
        <div className="RecentTransactionsList">
          {recentTransactions.map((transaction, index) =>
            renderTransaction(transaction, index),
          )}
        </div>
      </div>
      <div className="RatingBlocks">
        {/* <div className="RateBlock">
          <div className="RateBlockTitle">Top Paymasters</div>
          <div className="RateBlockList">
            <div className="RateBlockItem"></div>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default SummaryView;
