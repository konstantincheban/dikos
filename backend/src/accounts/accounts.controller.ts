import {
  instanceToPlain,
  plainToClass,
  plainToInstance,
} from 'class-transformer';
import {
  Body,
  Controller,
  Post,
  Param,
  Query,
  Get,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { Account, AccountDocument } from './schemas/accounts.schema';
import { AccountsService } from './accounts.service';
import { CreateAccountDTO } from './dto/create-account.dto';
import { EditAccountDTO } from './dto/edit-account.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import MongooseClassSerializerInterceptor from 'src/utils/mongooseClassSerializer.interceptor';
import { AccountSummaryDTO } from './dto/account-summary-dto';

@Controller('accounts')
@UseInterceptors(MongooseClassSerializerInterceptor(Account))
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllAccountsByUserId(
    @Query('filter') filter: string,
    @Query('orderby') orderBy: string,
    @Req() req,
  ): Promise<Account[]> {
    const test = await this.accountsService.getFilteredAccounts(
      filter ?? '',
      orderBy ?? '',
      req.user.id,
    );
    return test;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/summaryData/:id')
  async getAccountSummaryData(
    @Param('id') accountID: string,
    @Req() req,
  ): Promise<AccountSummaryDTO> {
    return await this.accountsService.getAccountSummary(accountID, req.user.id);
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
