import { CreateUserDTO } from './dto/create-user.dto';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import MongooseClassSerializerInterceptor from 'src/utils/mongooseClassSerializer.interceptor';
import { User } from './schemas/users.schema';

@Controller('users')
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async create(@Body() createCatDto: CreateUserDTO) {
    const user = await this.usersService.createUser(createCatDto);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/userData')
  async getUserData(@Req() req) {
    return await this.usersService.getUserData(req.user.id);
  }
}
