import { IsEmail, IsString } from "class-validator";

export class CreateUserDTO {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  // TODO: password validation
  password: string;
}
