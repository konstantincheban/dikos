import { Body, Controller, Post, Param, Query, Get } from '@nestjs/common';

import { TransactionDocument } from './schemas/transactions.schema';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDTO } from './dto/create-transaction.dto';
import { EditTransactionDTO } from './dto/edit-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async getAllTransactionsByUserId(@Query('filter') filter: string) {
    return await this.transactionsService.getFilteredAccounts(filter ?? '');
  }

  @Post('/create')
  async createTransaction(
    @Body() data: CreateTransactionDTO,
  ): Promise<TransactionDocument> {
    return await this.transactionsService.createTransaction(data);
  }

  @Post('/edit/:id')
  async editTransaction(
    @Param('id') transactionID: string,
    @Body() data: EditTransactionDTO,
  ): Promise<TransactionDocument> {
    return await this.transactionsService.editTransaction(transactionID, data);
  }

  @Post('/delete/:id')
  async deleteTransaction(@Param('id') transactionID: string): Promise<any> {
    return await this.transactionsService.deleteTransaction(transactionID);
  }
}
