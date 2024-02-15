import { ITransaction } from '@domain/transaction'

export interface IClient {
  id: number
  balance: number
  limite: number
  name: string
  transactions: ITransaction[]
}
