import { IsEmail, IsString } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  // TODO: password validation on the backend (can use IsStrongPassword)
  password: string;
}
