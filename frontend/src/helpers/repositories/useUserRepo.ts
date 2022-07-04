import { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { BudgetData, EditBudget } from '@interfaces';
import { useUsersObservable } from '@observables';
import { useUserApi } from '@api';
import { setErrorToState, repoWrapper } from './utils';

export const useUserRepository = () => {
  const userApi = useUserApi();
  const userObservable = useUsersObservable();

  const editBudget = (data: EditBudget, budgetID: string) => {
    return repoWrapper(userObservable, () =>
      userApi
        .editBudgetData<EditBudget>(data, budgetID)
        .then(({ data }: AxiosResponse<BudgetData>) => {
          toast.success('The budget calculation was successful');
          userObservable.updateBudgetData(data);
        })
        .catch((err) => setErrorToState(err, userObservable)),
    );
  };

  const getBudgetData = (budgetID: string) => {
    return repoWrapper(userObservable, () =>
      userApi
        .getBudgetData(budgetID)
        .then(({ data }: AxiosResponse<BudgetData>) => {
          userObservable.updateBudgetData(data);
        })
        .catch((err) => setErrorToState(err, userObservable)),
    );
  };

  const getUserObservable = () => userObservable.getObservable();

  return {
    editBudget,
    getBudgetData,
    getUserObservable,
  };
};
