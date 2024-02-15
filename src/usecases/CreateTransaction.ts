import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import IUseCase from '../infra/interfaces/IUseCase'
import TYPES from '../infra/server/Types'

import { IClient } from '../domain/client/interfaces/IClient'
import { IClientRepo } from '../domain/client/interfaces/IClientRepo'
import { ICreateTransaction } from '../domain/transaction/interfaces'

export type ICreateTransactionUseCaseParams = ICreateTransaction
export type ICreateTransactionrUseCaseResponse = IClient

@injectable()
export default class CreateTransaction
  implements
    IUseCase<
      ICreateTransactionUseCaseParams,
      ICreateTransactionrUseCaseResponse
    >
{
  constructor(
    @inject(TYPES.ClientRepository) private clientRepository: IClientRepo,
  ) {}

  async execute(
    params: ICreateTransactionUseCaseParams,
  ): Promise<ICreateTransactionrUseCaseResponse> {
    const { client_id, amount, type, description } = params
    return this.clientRepository.createTransaction({
      client_id,
      amount,
      type,
      description,
    })
  }
}
