import * as XLSX from 'xlsx';
import { AccountDocument } from '@accounts/schemas/accounts.schema';
import { Injectable } from '@nestjs/common';
import { AccountsService } from '@accounts/accounts.service';
import { TransactionsService } from '@transactions/transactions.service';
import { MigrationBaseClass, EventsGateway } from '@app/common';
import { getOptionsByMCC, transliterateString } from '@utils/utils';
interface AggregationConfig {
  userID: string;
  relatedAccount: AccountDocument;
  date: Date;
}

interface IData {
  userID: string;
  accountId: string;
  date: Date;
  file: Express.Multer.File;
}

interface MonoTransaction {
  'Date and time': string;
  Description: string;
  MCC: number;
  'Card currency amount, (UAH)': number;
  'Operation amount': number;
  'Operation currency': string;
  'Exchange rate': number | string;
  'Commission, (UAH)': number | string;
  'Cashback amount, (UAH)': number | string;
  Balance: number;
}

@Injectable()
export class MonoService extends MigrationBaseClass<
  MonoTransaction,
  IData
> {
  constructor(
    protected readonly transactionsService: TransactionsService,
    protected readonly accountsService: AccountsService,
    protected eventsGateway: EventsGateway,
  ) {
    super(transactionsService, accountsService, eventsGateway);
  }

  protected readonly eventsID = 'mono-migration';

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

    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hours),
      Number(minutes),
      Number(seconds),
    );
  }

  aggregateData(
    transactionsData: MonoTransaction[],
    config: AggregationConfig,
  ) {
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
      paymaster: null,
    };
    return transactionsData.map((transaction) => {
      const { category, description: shopDescription } = getOptionsByMCC(
        transaction['MCC'],
      );
      const transName = transliterateString(transaction['Description']);
      return {
        ...transactionSkeleton,
        date: this.parseDate(transaction['Date and time']),
        name: transName,
        description: transName,
        amount: transaction['Card currency amount, (UAH)'],
        category: category,
        paymaster: shopDescription,
      };
    });
  }
}
