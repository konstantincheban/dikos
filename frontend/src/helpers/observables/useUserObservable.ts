import { createSubject, useObservableBaseActions } from './utils';
import { BudgetData } from '@shared/interfaces';

export interface UserState {
  budgetData: BudgetData;
}

const initialState = {
  budgetData: {
    amount: 0,
    plannedCosts: 0,
    perDay: 0,
  },
};

const userSubject$ = createSubject<UserState>(initialState);

export const useUsersObservable = () => {
  const actions = useObservableBaseActions<UserState, UserState>(userSubject$);

  const updateBudgetData = (data: BudgetData) => {
    actions.setNextState({ budgetData: data, error: '' });
  };

  return {
    ...actions,
    updateBudgetData,
  };
};
