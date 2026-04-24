import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { EventsGateway, FileManagerService, WatcherService } from '@app/common';
import { StatisticsService } from '@statistics/statistics.service';
import { TransactionsService } from '@transactions/transactions.service';
import { Forecast } from './schemas/forecast.schema';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: getModelToken(Forecast.name),
          useValue: {},
        },
        {
          provide: TransactionsService,
          useValue: {},
        },
        {
          provide: StatisticsService,
          useValue: {},
        },
        {
          provide: FileManagerService,
          useValue: {},
        },
        {
          provide: WatcherService,
          useValue: {},
        },
        {
          provide: EventsGateway,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
