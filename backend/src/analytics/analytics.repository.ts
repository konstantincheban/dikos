import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { Forecast, ForecastDocument } from './schemas/forecast.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AnalyticsRepository extends AbstractRepository<ForecastDocument> {
  protected readonly logger = new Logger(AnalyticsRepository.name);

  constructor(
    @InjectModel(Forecast.name)
    forecastModel: Model<ForecastDocument>,
  ) {
    super(forecastModel);
  }
}
