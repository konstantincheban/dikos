export class AccountSummaryDTO {
  income: number;
  expenses: number;
  byDay: ByDateRangeDTO;
  byWeek: ByDateRangeDTO;
  byMonth: ByDateRangeDTO;
}

export class ByDateRangeDTO {
  amount: number;
  percentage: string;
}
