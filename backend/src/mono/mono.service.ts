import { AccountDocument } from '@accounts/schemas/accounts.schema';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AccountsService } from '@accounts/accounts.service';
import { TransactionsService } from '@transactions/transactions.service';
import { ImportedStatusDTO } from '../metro/dto/metro-import-status.dto';
import * as XLSX from 'xlsx';
import { MonoTransactionDTO } from './dto/mono-product.dto';
import { CreateTransactionDTO } from '@transactions/dto/create-transaction.dto';

interface AggregationConfig {
  userID: string;
  relatedAccount: AccountDocument;
  date: string;
}

@Injectable()
export class MonoService {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly accountsService: AccountsService,
  ) {}

  processImportFile(file: Express.Multer.File): MonoTransactionDTO[] {
    // Parse the CSV file
    const workbook = XLSX.read(file.buffer , { type: 'buffer' });
    // Assuming your CSV file has a single sheet
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // Convert the sheet to JSON
    return XLSX.utils.sheet_to_json(worksheet, { raw: true });
  }

  excelSerialDateToDate(serialDate) {
    // Excel base date is December 30, 1899
    const date = XLSX.SSF.parse_date_code(serialDate);

    return new Date(date.y, date.d - 1, date.m, date.H, date.M, date.S);
  }

  parseDate(excelDate: string | number): Date {
    if (typeof excelDate === 'number') {
      return this.excelSerialDateToDate(excelDate);
    }
    const [_, day, month, year, hours, minutes, seconds] =
        /(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2}):(\d{2})/.exec(excelDate);

    return new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes), Number(seconds));
  }

  aggregateData(transactionsData: MonoTransactionDTO[], config: AggregationConfig) {
    const { userID, relatedAccount, date } = config;
    const transactionSkeleton = {
      userID,
      accountID: relatedAccount._id,
      name: '',
      description: '',
      amount: 0,
      currency: relatedAccount.currency,
      category: '',
      date: date,
      paymaster: null
    };
    return transactionsData.map((transaction) => ({
      ...transactionSkeleton,
      date: this.parseDate(transaction['Date and time']).toISOString(),
      name: transaction['Description'],
      description: transaction['Description'],
      amount: transaction['Card currency amount, (UAH)'],
      category: 'Shopping',
      paymaster: `${transaction['MCC']}`
    }));
  }

  async migrateImportedTransactions(
    transactions: CreateTransactionDTO[],
  ): Promise<any> {
    const createTransactions = transactions.map((transaction) =>
      this.transactionsService.createTransaction(transaction),
    );
    return Promise.allSettled(createTransactions);
  }

  async importTransactions(
    userID: string,
    accountId: string,
    date: string,
    file: Express.Multer.File,
  ): Promise<ImportedStatusDTO> {
    const relatedAccount = await this.accountsService.getAccountById(accountId);
    if (!relatedAccount) {
      throw new BadRequestException(
        `You are using the wrong accountID - ${accountId}`,
      );
    }
    const transactions = this.processImportFile(file);
    // aggregated data
    const dikosTransactions = this.aggregateData(transactions, {
      userID,
      relatedAccount,
      date,
    });
    const statuses = await this.migrateImportedTransactions(dikosTransactions);
    return {
      message: 'Transactions imported successfully',
    };
  }
}
