import { getResponseErrorMessage } from '@api';

export const setErrorToState = (error: unknown, observable: any) => {
  const errorMessage = getResponseErrorMessage(error);
  observable.setError(errorMessage);
};
