import { getResponseErrorMessage } from '@api';
import { ObservableHook } from '@interfaces';

export const setErrorToState = (error: unknown, observable: ObservableHook) => {
  const errorMessage = getResponseErrorMessage(error);
  observable.setError(errorMessage);
};

export const repoWrapper = async <T>(observable: ObservableHook, callFunc: () => Promise<T>) => {
  observable.setLoadingState(true);
  const data = await callFunc();
  observable.setLoadingState(false);

  return Promise.resolve(data);
}