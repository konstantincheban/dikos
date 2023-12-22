import {
  Body,
  Controller,
  Post,
  Param,
  Query,
  Get,
  UseGuards,
  Req,
  UseInterceptors,
  Put,
  Delete
} from '@nestjs/common';

import {
  TransactionDocument,
  Transaction,
} from './schemas/transactions.schema';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDTO } from './dto/create-transaction.dto';
import { EditTransactionDTO } from './dto/edit-transaction.dto';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import MongooseClassSerializerInterceptor from '@utils/mongooseClassSerializer.interceptor';
import { DeleteTransactionsPayloadDTO } from './dto/delete-transactions-payload.dto';

@Controller('transactions')
@UseInterceptors(MongooseClassSerializerInterceptor(Transaction))
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllTransactionsByUserId(
    @Query('filter') filter: string,
    @Query('orderby') orderBy: string,
    @Query('top') top: string,
    @Query('count') count: boolean,
    @Req() req,
  ) {
    return await this.transactionsService.getFilteredTransactions(
      req.user.id,
      filter ?? '',
      orderBy ?? '',
      top ? Number(top) : 0,
      count !== undefined
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/proposedCategories')
  async getProposedCategories(
    @Query('top') top: string,
    @Req() req,
  ) {
    return await this.transactionsService.getTransactionProposedCategories(
      req.user.id,
      Number(top) ?? 0,
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
  @Put('/edit/:id')
  async editTransaction(
    @Param('id') transactionID: string,
    @Body() data: EditTransactionDTO,
  ): Promise<TransactionDocument> {
    return await this.transactionsService.editTransaction(transactionID, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/delete/:id')
  async deleteTransaction(@Param('id') transactionID: string): Promise<any> {
    return await this.transactionsService.deleteTransaction(transactionID);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/multi_delete')
  async deleteTransactions(@Body() payload: DeleteTransactionsPayloadDTO): Promise<any> {
    return await this.transactionsService.deleteTransactions(payload.entries);
  }
}
