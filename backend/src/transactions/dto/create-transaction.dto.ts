export class CreateTransactionDTO {
  readonly accountID: string;
  readonly name?: string;
  readonly description?: string;
  readonly amount: number;
  readonly currency: number;
  readonly category?: string;
  readonly date?: Date;
  readonly paymaster?: string;
}
