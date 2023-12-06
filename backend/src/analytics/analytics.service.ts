import * as fs from 'fs';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { TransactionsService } from '@transactions/transactions.service';
import { ForecastTypes, Periods } from './dto/forecast-dto';
import { Forecast, ForecastDocument, ForecastOptions, ForecastResult } from './schemas/forecast.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { spawn } from 'child_process';
import { Transaction } from '@transactions/schemas/transactions.schema';
import { StatisticsService } from '@statistics/statistics.service';

type ForecastType = Forecast['options']['forecastType'];

interface MLTransaction {
  dateTime: string;
  amount: number;
}

export const PERIODS = ['1M', '2M', '3M'] as const;
export const FORECAST_TYPES = ['income', 'outcome'] as const;

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Forecast.name)
    private readonly forecastModel: Model<ForecastDocument>,
    private readonly transactionsService: TransactionsService,
    private readonly statisticsService: StatisticsService
  ) {}

  logger = new Logger('AnalyticsService');

  pyLogger = new Logger('PythonProcess');

  defaultOptions: ForecastOptions = {
    startTime: '',
    period: '1M',
    nTransactions: 0,
    modelVersion: '1.0',
    forecastType: 'outcome'
  };

  validateParams(period: Periods) {
    if (!PERIODS.includes(period)) {
      throw new BadRequestException(`Wrong period value is used: ${period}. Please use following supported types of period: ${PERIODS.join(' ,')}`);
    }
  }

  runPythonChildProcess(data: string, period: Periods, forecastType: ForecastType): Promise<ForecastResult[]> {
    return new Promise(async (resolve, reject) => {
      await fs.promises.writeFile(`${process.cwd()}/machine_learning/data.json`, data, 'utf8');

      const pythonProcess = spawn('python3', [`${process.cwd()}/machine_learning/model.py`, period, forecastType]);

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
          const rawData = fs.readFileSync(`${process.cwd()}/machine_learning/results.json`, 'utf8')
          resolve(JSON.parse(JSON.parse(rawData)));
        }
      });
    });
  }

  async forecast(transactions: MLTransaction[], options: Forecast['options'], forecastType: ForecastType): Promise<ForecastResult[]> {
    try {
      const results = await this.runPythonChildProcess(JSON.stringify(transactions), options.period, forecastType);
      return results;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException('Something went wrong. Please try again');
    }
  }

  async buildParams(userID: string, period: Periods, forecastType: ForecastType, startTime: string) {
    const options: Forecast['options'] = this.defaultOptions;

    let amountFilter: {[key: string]: number} = { $gt: 0 };
    if (forecastType === 'outcome') amountFilter = { $lt: 0 };

    const transactions = await this.transactionsService.getTransactions(userID, { amount: amountFilter, date: { $lt: startTime} }, { date: 'desc' }, 'date amount -_id');
    options.period = period;
    options.nTransactions = transactions.length;
    options.startTime = startTime ?? transactions.at(0).date.toISOString();
    options.forecastType = forecastType;

    return { transactions, options };
  }

  processTransaction(transactions: Partial<Transaction>[]): MLTransaction[] {
    return transactions.map((trans) => ({ dateTime: trans.date.toISOString(), amount: trans.amount }));
  }

  async forecastIncome(userID: string, period: Periods, startTime: string) {
    this.validateParams(period);
    const { transactions, options } = await this.buildParams(userID, period, 'income', startTime);

    const result = await this.forecastModel.find({
      userID: userID,
      'options.startTime': options.startTime,
      'options.period': options.period,
      'options.nTransactions': options.nTransactions,
      'options.forecastType': options.forecastType
    }).sort({ created_at: -1 }).limit(1);
    if (result.length) {
      this.logger.log('Forecast with the same options was found, return it...');
      return result[0];
    }

    const processedTransactions = this.processTransaction(transactions);
    const results = await this.forecast(processedTransactions as MLTransaction[], options, 'income');

    this.logger.log('Creating new forecast instance...');

    return await new this.forecastModel({
      userID: userID,
      results: results,
      options: options
    }).save();
  }

  async forecastOutcome(userID: string, period: Periods, startTime: string) {
    this.validateParams(period);
    const { transactions, options } = await this.buildParams(userID, period, 'outcome', startTime);

    const result = await this.forecastModel.find({
      userID: userID,
      'options.startTime': options.startTime,
      'options.period': options.period,
      'options.nTransactions': options.nTransactions,
      'options.forecastType': options.forecastType
    }).sort({ created_at: -1 }).limit(1);
    if (result.length) {
      this.logger.log('Forecast with the same options was found, return it...');
      return result[0];
    }
    const processedTransactions = this.processTransaction(transactions);
    const results = await this.forecast(processedTransactions as MLTransaction[], options, 'outcome');

    this.logger.log('Creating new forecast instance...');

    return await new this.forecastModel({
      userID: userID,
      results: results,
      options: options
    }).save();
  }

  async getResults(userID: string) {
    const promises = FORECAST_TYPES.map(fType =>
      this.forecastModel.find({
        userID: userID,
        'options.forecastType': fType
      }).sort({ created_at: -1 }).limit(1)
    );

    const results = await Promise.all(promises);
    return results.flat();
  }

  async getTransactionsByForecastTimePeriod(userID: string, forecastType: ForecastTypes, forecastID: string) {
    const forecastItem = await this.forecastModel.find({ userID, _id: forecastID, 'options.forecastType': forecastType }).sort({ created_at: -1 }).limit(1);
    if (!forecastItem.length) {
      throw new BadRequestException(`There is no such forecast item: forecastType - ${forecastType}`);
    }

    const transactions = await this.statisticsService.getTransactionsDataForSpecificTimePeriod(
      userID,
      forecastItem[0].results.at(0).dateTime,
      forecastItem[0].results.at(-1).dateTime,
      forecastType
    );
    return transactions;
  }
}
