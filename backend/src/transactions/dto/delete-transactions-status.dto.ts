export class DeleteTransactionsStatusDTO {
  id: string;
  status: 'success' | 'failed';
  reason?: string;
}
