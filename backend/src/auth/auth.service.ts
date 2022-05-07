import * as bcrypt from 'bcrypt';

import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { CreateUserDTO } from './../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from './dto/login.dto';
import { UserDocument } from './../users/schemas/users.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private async generateToken(user: UserDocument) {
    const { id: userId, email, username } = user;
    const payload = {
      id: userId,
      email: email,
    };
    return {
      username,
      userId,
      email,
      token: this.jwtService.sign(payload),
    };
  }

  async login(userDto: LoginDTO) {
    const user = await this.validateUser(userDto);
    return this.generateToken(user);
  }

  async registration(userDto: CreateUserDTO) {
    const candidate = await this.usersService.getUserByEmail(userDto.email);
    if (candidate) {
      throw new BadRequestException('User with this email already exists');
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.usersService.createUser({
      ...userDto,
      password: hashPassword,
    });
    return this.generateToken(user);
  }

  async validateUser(userDto: LoginDTO): Promise<UserDocument> {
    const { email, password } = userDto;
    const user = await this.usersService.getUserByEmail(email);
    const passwordEquals = await bcrypt.compare(password, user?.password ?? '');
    if (user && passwordEquals) {
      return user;
    }
    throw new UnauthorizedException({ message: 'Incorrect email or password' });
  }
}
