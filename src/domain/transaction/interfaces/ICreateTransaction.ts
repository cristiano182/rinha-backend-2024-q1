import { ITransaction } from './ITransaction'

export interface ICreateTransaction
  extends Omit<ITransaction, 'id' | 'created_at'> {
  id?: number
  created_at?: Date
}
