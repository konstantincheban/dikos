import { Body, Controller, Post, Param, Query, Get } from '@nestjs/common';

import { AccountDocument } from './schemas/accounts.schema';
import { AccountsService } from './accounts.service';
import { CreateAccountDTO } from './dto/create-account.dto';
import { EditAccountDTO } from './dto/edit-account.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  async getAllAccountsByUserId(@Query('filter') filter: string) {
    return await this.accountsService.getFilteredAccounts(filter ?? '');
  }

  @Post('/create')
  async createAccount(
    @Body() data: CreateAccountDTO,
  ): Promise<AccountDocument> {
    return await this.accountsService.createAccount(data);
  }

  @Post('/edit/:id')
  async editAccount(
    @Param('id') accountID: string,
    @Body() data: EditAccountDTO,
  ): Promise<AccountDocument> {
    return await this.accountsService.editAccount(accountID, data);
  }

  @Post('/delete/:id')
  async deleteAccount(@Param('id') accountID: string): Promise<any> {
    return await this.accountsService.deleteAccount(accountID);
  }
}
