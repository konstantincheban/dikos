export class AccountSummaryDTO {
  income: number;
  outcome: number;
  byDay: ByDateRangeDTO;
  byWeek: ByDateRangeDTO;
  byMonth: ByDateRangeDTO;
}

export class ByDateRangeDTO {
  amount: number;
  percentage: string;
}
