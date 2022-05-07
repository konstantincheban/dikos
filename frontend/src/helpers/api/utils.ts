import axios from 'axios';

export const getResponseErrorMessage = (error: unknown): string => {
  let errorMessage = '';

  if (axios.isAxiosError(error)) {
    errorMessage = (error?.response?.data as Error).message;
  } else {
    console.error(error);
  }

  return errorMessage;
};
