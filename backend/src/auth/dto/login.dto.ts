import { IsEmail, IsString } from 'class-validator';

export class LoginDTO {
  @IsEmail()
  email: string;

  @IsString()
  // TODO: password validation on the backend side
  password: string;
}
