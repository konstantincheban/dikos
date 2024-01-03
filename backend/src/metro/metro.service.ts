import { AccountDocument } from '@accounts/schemas/accounts.schema';
import { Injectable } from '@nestjs/common';
import { AccountsService } from '@accounts/accounts.service';
import { TransactionsService } from '@transactions/transactions.service';
import { MigrationBaseClass, EventsGateway } from '@app/common';

interface MetroProduct {
  ' с НДС': number;
  'Единица измерения': string;
  'Код продукта': string;
  Количество: number;
  'Общая сумма с НДС': number;
  Описание: string;
  __rowNum__: number;
}

interface IData {
  userID: string;
  accountId: string;
  aggregationType: string;
  date: Date;
  file: Express.Multer.File;
}

interface AggregationConfig {
  userID: string;
  relatedAccount: AccountDocument;
  aggregationType: string;
  date: Date;
}

const PRDCTS_AS_TRANS = 'productsAsTransactions';
const CHECK_AS_TRANS = 'checkAsTransaction';
export const METRO_AGGR_TYPES = [PRDCTS_AS_TRANS, CHECK_AS_TRANS];

@Injectable()
export class MetroService extends MigrationBaseClass<MetroProduct, IData> {
  constructor(
    protected readonly transactionsService: TransactionsService,
    protected readonly accountsService: AccountsService,
    protected eventsGateway: EventsGateway,
  ) {
    super(transactionsService, accountsService, eventsGateway);
  }

  protected readonly eventsID = 'metro-migration';

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
      date: date,
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
}
