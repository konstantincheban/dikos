export class CreateAccountDTO {
  readonly userID: string;
  readonly name: string;
  readonly description?: string;
  readonly currency?: string;
  readonly type?: string;
}
