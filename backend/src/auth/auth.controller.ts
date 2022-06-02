import { CreateUserDTO } from '@users/dto/create-user.dto';
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() user: LoginDTO) {
    return this.authService.login(user);
  }

  @Post('/registration')
  async registration(@Body() user: CreateUserDTO) {
    return this.authService.registration(user);
  }
}
