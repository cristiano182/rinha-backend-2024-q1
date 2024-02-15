import { inject, injectable } from 'inversify'
import { isEmpty } from 'lodash'
import { PoolClient } from 'pg'
import { IClient } from '../../../../domain/client/interfaces/IClient'
import {
  IClientRepo,
  ICreateTransaction,
  IGetTransaction,
  IUpdateClient,
} from '../../../../domain/client/interfaces/IClientRepo'
import NotFoundException from '../../../../domain/exceptions/NotFoundException'
import UnprocessableEntityException from '../../../../domain/exceptions/UnprocessableEntityException'
import { ITransaction, TransactionType } from '../../../../domain/transaction'
import TYPES from '../../../server/Types'

@injectable()
export default class ClientRepository implements IClientRepo {
  constructor(
    @inject(TYPES.SQLModuleConnection) private readonly poolClient: PoolClient,
  ) {}

  async createTransaction(
    params: IUpdateClient & ICreateTransaction,
  ): Promise<IClient> {
    const { client_id, amount, description } = params

    let client = {} as IClient & { error: string }

    if (params.type === TransactionType.CREDIT) {
      client = (
        await this.poolClient.query<IClient & { error: string }>(
          `SELECT * FROM credit($1 ,$2 , $3);`,
          [client_id, amount, description],
        )
      ).rows[0]
    } else {
      client = (
        await this.poolClient.query<IClient & { error: string }>(
          `SELECT * FROM debit($1 ,$2 , $3);`,
          [client_id, amount, description],
        )
      ).rows[0]
    }

    if (!client || client.error)
      throw new UnprocessableEntityException('operation not permited')

    return { limite: client.limite, balance: client.balance } as IClient
  }

  async getTransaction(
    params: IGetTransaction,
  ): Promise<Array<IClient & ITransaction>> {
    const transactions = (
      await this.poolClient.query<ITransaction & IClient>(
        `
    SELECT *
    FROM view_clients_transactions t
    WHERE t.client_id = $1
    ORDER BY t.created_at DESC
    LIMIT 10;
    `,
        [params.client_id],
      )
    ).rows
    if (isEmpty(transactions)) throw new NotFoundException('client not found')
    return transactions
  }
}
