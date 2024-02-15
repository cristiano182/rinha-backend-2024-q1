import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import IUseCase from '../infra/interfaces/IUseCase'
import TYPES from '../infra/server/Types'

import { IClient } from '@domain/client'
import { ITransaction } from '@domain/transaction'
import { IClientRepo } from '../domain/client/interfaces/IClientRepo'

export type IListTransactionUseCaseParams = { client_id: number }
export type IListTransactionrUseCaseResponse = Array<IClient & ITransaction>

@injectable()
export default class ListTransaction
  implements
    IUseCase<IListTransactionUseCaseParams, IListTransactionrUseCaseResponse>
{
  constructor(
    @inject(TYPES.ClientRepository) private clientRepository: IClientRepo,
  ) {}

  async execute(
    params: IListTransactionUseCaseParams,
  ): Promise<IListTransactionrUseCaseResponse> {
    return await this.clientRepository.getTransaction({
      client_id: params.client_id,
    })
  }
}
