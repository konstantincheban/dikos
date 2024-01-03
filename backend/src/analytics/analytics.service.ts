import * as fs from 'fs';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { TransactionsService } from '@transactions/transactions.service';
import { ForecastTypes, Periods } from './dto/forecast-dto';
import {
  Forecast,
  ForecastOptions,
  ForecastResult,
} from './schemas/forecast.schema';
import { InjectModel } from '@nestjs/mongoose';
import { spawn } from 'child_process';
import { Transaction } from '@transactions/schemas/transactions.schema';
import { StatisticsService } from '@statistics/statistics.service';
import { EventsGateway } from '@app/common';
import { AnalyticsRepository } from './analytics.repository';

type ForecastType = Forecast['options']['forecastType'];

interface MLTransaction {
  dateTime: string;
  amount: number;
}

export const PERIODS = ['1M', '2M', '3M'] as const;
export const FORECAST_TYPES = ['income', 'expenses'] as const;
export const MIN_TRANSACTIONS_AMOUNT = 100;

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Forecast.name)
    private readonly analyticsRepo: AnalyticsRepository,
    private readonly transactionsService: TransactionsService,
    private readonly statisticsService: StatisticsService,
    private eventsGateway: EventsGateway,
  ) {}

  logger = new Logger('AnalyticsService');

  pyLogger = new Logger('PythonProcess');

  defaultOptions: ForecastOptions = {
    startTime: '',
    period: '1M',
    nTransactions: 0,
    modelVersion: '1.0',
    forecastType: 'expenses',
  };

  validateParams(period: Periods) {
    if (!PERIODS.includes(period)) {
      throw new BadRequestException(
        `Wrong period value is used: ${period}. Please use following supported types of period: ${PERIODS.join(
          ' ,',
        )}`,
      );
    }
  }

  async validateRequirements(userID: string) {
    const numberOfTransaction =
      await this.transactionsService.getTransactionsCount({
        filter: { userID },
      });
    if (numberOfTransaction.count < MIN_TRANSACTIONS_AMOUNT) {
      throw new BadRequestException(
        `Number of available transactions: ${numberOfTransaction.count}. Required number of transactions to perform forecasting: ${MIN_TRANSACTIONS_AMOUNT}`,
      );
    }
  }

  runPythonChildProcess(
    data: string,
    period: Periods,
    forecastType: ForecastType,
  ): Promise<ForecastResult[]> {
    return new Promise(async (resolve, reject) => {
      await fs.promises.writeFile(
        `${process.cwd()}/machine_learning/data.json`,
        data,
        'utf8',
      );

      const pythonProcess = spawn('python3', [
        `${process.cwd()}/machine_learning/model.py`,
        period,
        forecastType,
      ]);

      pythonProcess.stdout.on('data', (data) => {
        this.pyLogger.log(`Logs: ${data}`);
      });
      pythonProcess.stderr.on('data', (error) => {
        reject(`Error: ${error}`);
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          reject(`Python script exited with code ${code}`);
        } else {
          this.pyLogger.log(`Python script exited with code ${code}`);
          const rawData = fs.readFileSync(
            `${process.cwd()}/machine_learning/results.json`,
            'utf8',
          );
          resolve(JSON.parse(JSON.parse(rawData)));
        }
      });
    });
  }

  async forecast(
    transactions: MLTransaction[],
    options: Forecast['options'],
    forecastType: ForecastType,
  ): Promise<ForecastResult[]> {
    try {
      const results = await this.runPythonChildProcess(
        JSON.stringify(transactions),
        options.period,
        forecastType,
      );
      return results;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException('Something went wrong. Please try again');
    }
  }

  async buildParams(
    userID: string,
    period: Periods,
    forecastType: ForecastType,
    startTime: Date,
  ) {
    const options: Forecast['options'] = this.defaultOptions;

    let amountFilter: { [key: string]: number } = { $gt: 0 };
    if (forecastType === 'expenses') amountFilter = { $lt: 0 };

    const transactions = await this.transactionsService.getTransactions({
      filter: { amount: amountFilter, date: { $lt: startTime }, userID },
      sort: { date: 'desc' },
      select: 'date amount -_id',
    });
    options.period = period;
    options.nTransactions = transactions.length;
    options.startTime = (startTime ?? transactions.at(0).date).toISOString();
    options.forecastType = forecastType;

    return { transactions, options };
  }

  processTransaction(transactions: Partial<Transaction>[]): MLTransaction[] {
    return transactions.map((trans) => ({
      dateTime: trans.date.toISOString(),
      amount: trans.amount,
    }));
  }

  async forecastHandler(
    userID: string,
    period: Periods,
    startTime: Date,
    forecastType: ForecastType,
  ) {
    try {
      const { transactions, options } = await this.buildParams(
        userID,
        period,
        forecastType,
        startTime,
      );

      const result = await this.analyticsRepo
        .find({
          userID: userID,
          'options.startTime': options.startTime,
          'options.period': options.period,
          'options.nTransactions': options.nTransactions,
          'options.forecastType': options.forecastType,
        })
        .sort({ updated_at: -1 })
        .limit(1);
      if (result.length) {
        this.logger.log(
          'Forecast with the same options was found, return it...',
        );
        const updated = await this.analyticsRepo.findOneAndUpdate(
          { _id: result[0]._id },
          { $set: { updated_at: new Date() } },
        );
        this.eventsGateway.send('forecast', {
          status: 'success',
          message: 'Forecast with the same options was found',
        });
        return updated;
      }

      this.eventsGateway.send('forecast', {
        status: 'progress',
        message: 'Forecasting is in progress',
      });

      const processedTransactions = this.processTransaction(transactions);
      const results = await this.forecast(
        processedTransactions as MLTransaction[],
        options,
        forecastType,
      );

      await this.analyticsRepo.create({
        userID: userID,
        results: results,
        options: options,
      });
      this.eventsGateway.send('forecast', {
        status: 'success',
        message: 'Forecasting finished successfully',
      });
    } catch (err) {
      this.eventsGateway.send('forecast', {
        status: 'failed',
        message: 'Forecasting failed',
      });
    }
  }

  async forecastIncomeOrExpenses(
    userID: string,
    period: Periods,
    startTime: Date,
    forecastType: ForecastType,
  ) {
    this.validateParams(period);
    await this.validateRequirements(userID);
    this.forecastHandler(userID, period, startTime, forecastType);

    return {
      message: 'Creating new forecast instance...',
    };
  }

  async getResults(userID: string) {
    const promises = FORECAST_TYPES.map((fType) =>
      this.analyticsRepo
        .find({
          userID: userID,
          'options.forecastType': fType,
        })
        .sort({ updated_at: -1 })
        .limit(1),
    );

    const results = await Promise.all(promises);
    return results.flat();
  }

  async getTransactionsByForecastTimePeriod(
    userID: string,
    forecastType: ForecastTypes,
    forecastID: string,
  ) {
    const forecastItem = await this.analyticsRepo
      .find({ userID, _id: forecastID, 'options.forecastType': forecastType })
      .sort({ created_at: -1 })
      .limit(1);
    if (!forecastItem.length) {
      throw new BadRequestException(
        `There is no such forecast item: forecastType - ${forecastType}`,
      );
    }

    const transactions =
      await this.statisticsService.getTransactionsDataForSpecificTimePeriod(
        userID,
        forecastItem[0].results.at(0).dateTime,
        forecastItem[0].results.at(-1).dateTime,
        forecastType,
      );
    return transactions;
  }
}
