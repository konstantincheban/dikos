import {
  Body,
  Controller,
  Post,
  Param,
  Query,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';

import { TransactionDocument } from './schemas/transactions.schema';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDTO } from './dto/create-transaction.dto';
import { EditTransactionDTO } from './dto/edit-transaction.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllTransactionsByUserId(
    @Query('filter') filter: string,
    @Query('orderby') orderBy: string,
    @Req() req,
  ) {
    return await this.transactionsService.getFilteredAccounts(
      filter ?? '',
      orderBy ?? '',
      req.user.id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async createTransaction(
    @Body() data: CreateTransactionDTO,
    @Req() req,
  ): Promise<TransactionDocument> {
    return await this.transactionsService.createTransaction({
      ...data,
      userID: req.user.id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('/edit/:id')
  async editTransaction(
    @Param('id') transactionID: string,
    @Body() data: EditTransactionDTO,
  ): Promise<TransactionDocument> {
    return await this.transactionsService.editTransaction(transactionID, data);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/delete/:id')
  async deleteTransaction(@Param('id') transactionID: string): Promise<any> {
    return await this.transactionsService.deleteTransaction(transactionID);
  }
}
