import { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { BudgetData, EditBudget } from '@interfaces';
import { useUsersObservable } from '@observables';
import { useUserApi } from '@api';
import { setErrorToState } from './utils';

export const useUserRepository = () => {
  const userApi = useUserApi();
  const userObservable = useUsersObservable();

  const editBudget = async (data: EditBudget, budgetID: string) => {
    userObservable.setLoadingState(true);
    await userApi
      .editBudgetData<EditBudget>(data, budgetID)
      .then(({ data }: AxiosResponse<BudgetData>) => {
        toast.success('The budget calculation was successful');
        userObservable.updateBudgetData(data);
        userObservable.setLoadingState(false);
      })
      .catch((err) => setErrorToState(err, userObservable));
  };

  const getBudgetData = async (budgetID: string) => {
    userObservable.setLoadingState(true);
    await userApi
      .getBudgetData(budgetID)
      .then(({ data }: AxiosResponse<BudgetData>) => {
        userObservable.updateBudgetData(data);
        userObservable.setLoadingState(false);
      })
      .catch((err) => setErrorToState(err, userObservable));
  };

  const getUserObservable = () => userObservable.getObservable();

  return {
    editBudget,
    getBudgetData,
    getUserObservable,
  };
};
