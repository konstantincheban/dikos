export class MonoTransactionDTO {
  'Date and time': string;
  'Description': string;
  'MCC': number;
  'Card currency amount, (UAH)': number;
  'Operation amount': number;
  'Operation currency': string;
  'Exchange rate': number | string;
  'Commission, (UAH)': number | string;
  'Cashback amount, (UAH)': number | string;
  'Balance': number;
}
