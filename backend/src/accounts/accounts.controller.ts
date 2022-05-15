import {
  Body,
  Controller,
  Post,
  Param,
  Query,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AccountDocument } from './schemas/accounts.schema';
import { AccountsService } from './accounts.service';
import { CreateAccountDTO } from './dto/create-account.dto';
import { EditAccountDTO } from './dto/edit-account.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllAccountsByUserId(@Query('filter') filter: string) {
    return await this.accountsService.getFilteredAccounts(filter ?? '');
  }

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async createAccount(
    @Body() data: CreateAccountDTO,
    @Req() req,
  ): Promise<AccountDocument> {
    return await this.accountsService.createAccount({
      ...data,
      userID: req.user.id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('/edit/:id')
  async editAccount(
    @Param('id') accountID: string,
    @Body() data: EditAccountDTO,
  ): Promise<AccountDocument> {
    return await this.accountsService.editAccount(accountID, data);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/delete/:id')
  async deleteAccount(@Param('id') accountID: string): Promise<any> {
    return await this.accountsService.deleteAccount(accountID);
  }
}
