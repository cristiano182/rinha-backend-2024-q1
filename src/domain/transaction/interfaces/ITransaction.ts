export enum TransactionType {
  CREDIT = 'c',
  DEBIT = 'd',
}
export interface ITransaction {
  id?: number
  client_id: number
  amount: number
  type: TransactionType
  description: string
  created_at: Date
}
