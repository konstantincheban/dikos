export interface IUser {
  username: string;
  email: string;
  password: string;
  budgetID: string;
}

export type UserData = Omit<IUser, 'password'>;

export type LoginRequest = Omit<IUser, 'username' | 'budgetID'>;
export type LoginResponse = Omit<IUser, 'password' | 'budgetID'> & {
  token: string;
};

export type RegistrationRequest = Omit<IUser, 'budgetID'>;
export type RegistrationResponse = LoginResponse;
