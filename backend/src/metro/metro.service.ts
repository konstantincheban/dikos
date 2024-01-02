import { AccountDocument } from '@accounts/schemas/accounts.schema';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AccountsService } from '@accounts/accounts.service';
import { TransactionsService } from '@transactions/transactions.service';
import * as XLSX from 'xlsx';
import { CreateTransactionDTO } from '@transactions/dto/create-transaction.dto';
import { EventsGateway } from '@events/events.gateway';

interface MetroProduct {
  ' с НДС': number;
  'Единица измерения': string;
  'Код продукта': string;
  'Количество': number;
  'Общая сумма с НДС': number;
  'Описание': string;
  '__rowNum__': number;
}
const PRDCTS_AS_TRANS = 'productsAsTransactions';
const CHECK_AS_TRANS = 'checkAsTransaction';
export const METRO_AGGR_TYPES = [PRDCTS_AS_TRANS, CHECK_AS_TRANS];

interface AggregationConfig {
  userID: string;
  relatedAccount: AccountDocument;
  aggregationType: string;
  date: string;
}

@Injectable()
export class MetroService {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly accountsService: AccountsService,
    private eventsGateway: EventsGateway
  ) {}

  processImportFile(file: Express.Multer.File): MetroProduct[] {
    // Read the file into memory
    const workbook = XLSX.read(file.buffer);
    // Convert the XLSX to JSON
    const worksheets = [];
    for (const sheetName of workbook.SheetNames) {
      // Some helper functions in XLSX.utils generate different views of the sheets:
      //     XLSX.utils.sheet_to_csv generates CSV
      //     XLSX.utils.sheet_to_txt generates UTF16 Formatted Text
      //     XLSX.utils.sheet_to_html generates HTML
      //     XLSX.utils.sheet_to_json generates an array of objects
      //     XLSX.utils.sheet_to_formulae generates a list of formulae
      const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      worksheets.push(data);
    }

    return worksheets.flat();
  }

  // TEST PURPOSES
  randomDate(start, end) {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime()),
    );
  }

  aggregateData(metroData: MetroProduct[], config: AggregationConfig) {
    const { userID, relatedAccount, aggregationType, date } = config;
    const transactionSkeleton = {
      userID,
      accountID: relatedAccount._id,
      name: '',
      description: '',
      amount: 0,
      currency: relatedAccount.currency,
      category: '',
      date: new Date(date),
      paymaster: 'Metro',
    };
    // aggregation strategy - productsAsTransactions
    if (aggregationType === PRDCTS_AS_TRANS) {
      return metroData.map((metroProduct) => ({
        ...transactionSkeleton,
        date: new Date(date),
        name: `${metroProduct['Описание']}`,
        description: `Code of product - ${metroProduct['Код продукта']}`,
        amount: -metroProduct['Общая сумма с НДС'],
        category: 'Shopping',
      }));
    }
    // aggregation strategy - checkAsTransaction
    if (aggregationType === CHECK_AS_TRANS) {
      const checkAmount = metroData.reduce((acc: number, metroProduct) => {
        acc -= metroProduct['Общая сумма с НДС'];
        return acc;
      }, 0);
      return [
        {
          ...transactionSkeleton,
          amount: Number(checkAmount.toFixed(2)),
          name: `Metro check for the date - ${new Date().toISOString()}`,
        },
      ];
    }
  }

  async migrateImportedTransactions(
    transactions: (CreateTransactionDTO & { userID: string})[],
  ): Promise<any> {
    const createTransactions = transactions.map((transaction) =>
      this.transactionsService.createTransaction(transaction),
    );
    return Promise.allSettled(createTransactions);
  }

  async importTransactionsHandler(
    userID: string,
    accountId: string,
    aggregationType: string,
    date: string,
    file: Express.Multer.File,
  ) {
    try {
      const relatedAccount = await this.accountsService.getAccountById(accountId);
      if (!relatedAccount) {
        throw new BadRequestException(
          `You are using the wrong accountID - ${accountId}`,
        );
      }
      const metroProducts = this.processImportFile(file);
      // aggregated data
      const dikosTransactions = this.aggregateData(metroProducts, {
        userID,
        relatedAccount,
        aggregationType,
        date,
      });
      await this.migrateImportedTransactions(dikosTransactions);
      this.eventsGateway.send(
        'metro-migration',
        {
          status: 'success',
          message: 'Import finished successfully',
        }
      );
    } catch (err) {
      this.eventsGateway.send(
        'metro-migration',
        {
          status: 'failed',
          message: 'Import failed',
        }
      );
    }
  }

  async importTransactions(
    userID: string,
    accountId: string,
    aggregationType: string,
    date: string,
    file: Express.Multer.File,
  ) {
    this.eventsGateway.send(
      'metro-migration',
      {
        status: 'progress',
        message: 'Import & Migration is in progress'
      }
    );
    this.importTransactionsHandler(
      userID,
      accountId,
      aggregationType,
      date,
      file
    );
    return {
      message: 'Initiated import & migration process',
    };
  }
}
