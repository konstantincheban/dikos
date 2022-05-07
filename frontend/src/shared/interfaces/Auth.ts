export interface IUser {
  username: string;
  email: string;
  password: string;
}

export type LoginRequest = Omit<IUser, 'username'>;
export type LoginResponse = Omit<IUser, 'password'> & {
  userId: string;
  token: string;
};

export type RegistrationRequest = IUser;
export type RegistrationResponse = LoginResponse;
