import axios from 'axios';

export const getResponseErrorMessage = (error: unknown): string => {
  let errorMessage = '';

  if (axios.isAxiosError(error)) {
    errorMessage =
      (error?.response?.data as Error)?.message ?? 'Failed request';
  } else {
    console.error(error);
  }

  return errorMessage;
};
