import * as XLSX from 'xlsx';
import { Logger } from '@nestjs/common';
import { EventsGateway } from '../events';
import { AccountsService } from '@accounts/accounts.service';
import { TransactionsService } from '@transactions/transactions.service';
import { CreateTransactionDTO } from '@transactions/dto/create-transaction.dto';
import { BadRequestException } from '@nestjs/common';
import { AccountDocument } from '@accounts/schemas/accounts.schema';

interface BasicData {
  accountId: string;
  file: Express.Multer.File;
}

export abstract class MigrationBaseClass<TMigrationItem, TData extends BasicData> {
  constructor(
    protected readonly transactionsService: TransactionsService,
    protected readonly accountsService: AccountsService,
    protected eventsGateway: EventsGateway,
  ) {
  }
  protected abstract aggregateData(transactions: TMigrationItem[], option: TData & { relatedAccount: AccountDocument }): (CreateTransactionDTO & { userID: string })[];

  protected abstract readonly eventsID: string;

  logger = new Logger('MigrationBase');

  processImportFile(file: Express.Multer.File): TMigrationItem[] {
    // Parse the CSV file
    const workbook = XLSX.read(file.buffer, {
      type: 'buffer',
      codepage: 65001,
    });
    // Assuming your CSV file has a single sheet
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // Convert the sheet to JSON
    return XLSX.utils.sheet_to_json(worksheet, { raw: true });
  }

  async importTransactionsHandler(data: TData) {
    try {
      const { accountId, file } = data;
      const relatedAccount = await this.accountsService.getAccountById(
        accountId,
      );
      if (!relatedAccount) {
        throw new BadRequestException(
          `You are using the wrong accountID - ${accountId}`,
        );
      }
      const transactions = this.processImportFile(file);
      // aggregated data
      const dikosTransactions = this.aggregateData(transactions, {
        ...data,
        relatedAccount
      });
      await this.migrateImportedTransactions(dikosTransactions);
      this.eventsGateway.send(this.eventsID, {
        status: 'success',
        message: 'Import finished successfully',
      });
    } catch (err) {
      this.logger.error(err);
      this.eventsGateway.send(this.eventsID, {
        status: 'failed',
        message: 'Import failed',
      });
    }
  }

  async migrateImportedTransactions(
    transactions: (CreateTransactionDTO & { userID: string })[],
  ): Promise<any> {
    const createTransactions = transactions.map((transaction) =>
      this.transactionsService.createTransaction(transaction),
    );
    return Promise.allSettled(createTransactions);
  }

  async importTransactions(data: TData) {
    this.eventsGateway.send(this.eventsID, {
      status: 'progress',
      message: 'Import & Migration is in progress',
    });
    this.importTransactionsHandler(data);
    return {
      message: 'Initiated import & migration process',
    };
  }
}
