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
  Put,
  Delete,
} from '@nestjs/common';

import { Account } from './schemas/accounts.schema';
import { AccountsService } from './accounts.service';
import { CreateAccountDTO } from './dto/create-account.dto';
import { EditAccountDTO } from './dto/edit-account.dto';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { MongooseClassSerializerInterceptor } from '@app/common';

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
  ) {
    const test = await this.accountsService.getFilteredAccounts(
      filter ?? '',
      orderBy ?? '',
      req.user.id,
    );
    return test;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/summaryData/:id')
  async getAccountSummaryData(@Param('id') accountID: string, @Req() req) {
    return await this.accountsService.getAccountSummary(accountID, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async createAccount(@Body() data: CreateAccountDTO, @Req() req) {
    return await this.accountsService.createAccount({
      ...data,
      userID: req.user.id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Put('/edit/:id')
  async editAccount(
    @Param('id') accountID: string,
    @Body() data: EditAccountDTO,
  ) {
    return await this.accountsService.editAccount(accountID, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/delete/:id')
  async deleteAccount(@Param('id') accountID: string) {
    return await this.accountsService.deleteAccount(accountID);
  }
}
