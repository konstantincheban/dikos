import { createSubject, useObservableBaseActions } from './utils';

export type TransactionsState = {
  isUpToDate: boolean;
};

const initialState = {
  isUpToDate: false,
};

const transactionsSubject$ = createSubject<TransactionsState>(initialState);

export const useTransactionsObservable = () => {
  const actions = useObservableBaseActions<
    TransactionsState,
    TransactionsState
  >(transactionsSubject$);

  const setUpToDateState = (state: boolean) => {
    actions.setNextState({ isUpToDate: state, error: '' });
  };

  return {
    ...actions,
    setUpToDateState,
  };
};
