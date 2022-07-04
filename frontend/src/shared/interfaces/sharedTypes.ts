import { BehaviorSubject } from "rxjs";

export type KeyValueType = {
  [key: string]: string;
};

export type Error = {
  message: string;
};

export interface IModalFormRef {
  submitForm: () => void;
}

export type ObservableHook = {
  setError: (message: string) => void;
  setLoadingState: (state: boolean) => void;
  setNextState: (payload: any) => void;
  getObservable: () => BehaviorSubject<any>;
}