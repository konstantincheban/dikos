import { AccountDocument } from './../accounts/schemas/accounts.schema';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AccountsService } from 'src/accounts/accounts.service';
import { TransactionsService } from 'src/transactions/transactions.service';
import { ImportedStatusDTO } from './dto/metro-import-status.dto';
import * as XLSX from 'xlsx';
import { MetroProductDTO } from './dto/metro-product.dto';
import { CreateTransactionDTO } from 'src/transactions/dto/create-transaction.dto';

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
  ) {}

  processImportFile(file: Express.Multer.File): MetroProductDTO[] {
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

  aggregateData(metroData: MetroProductDTO[], config: AggregationConfig) {
    const { userID, relatedAccount, aggregationType, date } = config;
    const transactionSkeleton = {
      userID,
      accountID: relatedAccount._id,
      name: '',
      description: '',
      amount: 0,
      currency: relatedAccount.currency,
      category: '',
      date: date,
      paymaster: 'Metro',
    };
    // aggregation strategy - productsAsTransactions
    if (aggregationType === 'productsAsTransactions') {
      return metroData.map((metroProduct) => ({
        ...transactionSkeleton,
        date: date,
        name: `${metroProduct['Описание']}`,
        description: `Code of product - ${metroProduct['Код продукта']}`,
        amount: -metroProduct['Общая сумма с НДС'],
        category: 'Shopping',
      }));
    }
    // aggregation strategy - checkAsTransaction
    if (aggregationType === 'checkAsTransaction') {
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
    aggregationType: string,
    date: string,
    file: Express.Multer.File,
  ): Promise<ImportedStatusDTO> {
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
    const statuses = await this.migrateImportedTransactions(dikosTransactions);
    return {
      message: 'Transactions imported successfully',
    };
  }
}
