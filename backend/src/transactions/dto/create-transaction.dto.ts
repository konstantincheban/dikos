export class CreateTransactionDTO {
  readonly userID: string;
  readonly accountID: string;
  readonly name?: string;
  readonly description?: string;
  readonly amount: number;
  readonly currency: number;
  readonly category?: string;
  readonly date?: Date;
  readonly paymaster?: string;
}
