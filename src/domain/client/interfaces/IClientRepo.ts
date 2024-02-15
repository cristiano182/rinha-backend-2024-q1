import { TransactionType } from '@domain/transaction'
import { ITransaction } from '../../transaction/interfaces'
import { IClient } from './IClient'

export interface IGetClient {
  client_id: number
}
export interface IUpdateClient {
  client_id: number
}
export interface ICreateTransaction {
  client_id: number
  amount: number
  type: TransactionType
  description: string
}
export interface IGetTransaction {
  client_id: number
}

export interface IClientRepo {
  createTransaction(
    params: IUpdateClient & ICreateTransaction,
  ): Promise<IClient>
  getTransaction(
    params: IGetTransaction,
  ): Promise<Array<ITransaction & IClient>>
}
