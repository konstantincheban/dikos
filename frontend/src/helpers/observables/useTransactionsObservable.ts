import { AttributeItem } from '@base/TagEditor';
import { createSubject, useObservableBaseActions } from './utils';

export type TransactionsState = {
  isUpToDate: boolean;
  proposedCategories: AttributeItem[];
  transactionsCount: number;
};

const initialState = {
  isUpToDate: false,
  proposedCategories: [],
  transactionsCount: 0
};

const transactionsSubject$ = createSubject<TransactionsState>(initialState);

export const useTransactionsObservable = () => {
  const actions = useObservableBaseActions<
    TransactionsState,
    TransactionsState
  >(transactionsSubject$);

  const setProposedCategories = (categories: AttributeItem[]) => {
    actions.setNextState({ proposedCategories: categories });
  }

  const setTransactionsCount = (count: number) => {
    actions.setNextState({ transactionsCount: count });
  }

  const setUpToDateState = (state: boolean) => {
    actions.setNextState({ isUpToDate: state, error: '' });
  };

  return {
    ...actions,
    setUpToDateState,
    setProposedCategories,
    setTransactionsCount
  };
};
