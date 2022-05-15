export class EditTransactionDTO {
  readonly name?: string;
  readonly description?: string;
  readonly amount: number;
  readonly currency: string;
  readonly category?: string;
  readonly date?: Date;
  readonly paymaster?: string;
}
