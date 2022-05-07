import { BehaviorSubject } from 'rxjs';

export type IState<T> = T & {
  loading: boolean;
  error: string;
};

export const createSubject = <StateType>(initialState: StateType) => {
  return new BehaviorSubject<StateType>({
    ...initialState,
    loading: false,
    error: '',
  });
};
