import { AttributeItem } from '@base/TagEditor';
import { createSubject, useObservableBaseActions } from './utils';

export type TransactionsState = {
  isUpToDate: boolean;
  proposedCategories: AttributeItem[];
};

const initialState = {
  isUpToDate: false,
  proposedCategories: []
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

  const setUpToDateState = (state: boolean) => {
    actions.setNextState({ isUpToDate: state, error: '' });
  };

  return {
    ...actions,
    setUpToDateState,
    setProposedCategories
  };
};
