export interface ILoginProps<T> {
  submitAction: (values: T) => void;
}

export interface IRegistrationProps<T> {
  submitAction: (values: T) => void;
}

export interface ILoginData {
  email: string;
  password: string;
}

export interface IRegistrationData {
  username: string;
  email: string;
  password: string;
}

export type AuthStateEnum = 'login' | 'registration';
