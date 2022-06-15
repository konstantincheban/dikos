import { textToID } from '@shared/utils';
import { toast } from 'react-toastify';
import { BehaviorSubject } from 'rxjs';

export type IState<T = unknown> = T & {
  loading: boolean;
  error: string;
};

export type StoreSubjectPayload<T> = Partial<IState<T>>;

export const createSubject = <StateType>(initialState: StateType) => {
  return new BehaviorSubject<IState<StateType>>({
    ...initialState,
    loading: false,
    error: '',
  });
};

export const useObservableBaseActions = <StateType, PayloadType>(
  subject: BehaviorSubject<IState<StateType>>,
) => {
  const setError = (message: string) => {
    toast.error(message, {
      toastId: textToID(message),
    });
    setNextState({ error: message } as StoreSubjectPayload<PayloadType>);
  };

  const setLoadingState = (state: boolean) => {
    setNextState({ loading: state } as StoreSubjectPayload<PayloadType>);
  };

  const setNextState = (payload: StoreSubjectPayload<PayloadType>) => {
    const state = subject.getValue();
    subject.next({ ...state, ...payload });
  };

  const getObservable = () => {
    return subject;
  };

  return {
    setError,
    setLoadingState,
    getObservable,
    setNextState,
  };
};
