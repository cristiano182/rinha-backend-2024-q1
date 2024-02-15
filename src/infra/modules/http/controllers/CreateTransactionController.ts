import 'reflect-metadata'
import { Request, Response, Server } from 'hyper-express'
import { inject, injectable } from 'inversify'
import { TransactionType } from '../../../../domain/transaction'
import CreateTransaction from '../../../../usecases/CreateTransaction'
import { IController } from '../../../interfaces/IController'
import TYPES from '../../../server/Types'
import { CreateTransactionSchema } from './schemas/CreateTransactionSchema'
import Validator from '../../../../infra/utils/validator'
import { ValidateFunction } from 'ajv'

interface ICreateTransactionParams {
  client_id: number
  valor: number
  tipo: TransactionType
  descricao: string
}

@injectable()
export default class CreateTransactionController implements IController {
  private schema: ValidateFunction
  constructor(
    @inject(TYPES.CreateTransaction)
    private createTransaction: CreateTransaction,
  ) {
    this.schema = Validator.schema(CreateTransactionSchema)
  }

  async execute(httpInstance: Server): Promise<Server> {
    return httpInstance.post(
      '/clientes/:client_id/transacoes',
      async (request: Request, response: Response) => {
        const body = await request.json()

        const params: ICreateTransactionParams = {
          ...body,
          client_id: +request.path_parameters.client_id,
        }
        Validator.validate(this.schema, params)

        const { client_id, valor, tipo, descricao } = params

        const payload = {
          client_id,
          amount: valor,
          type: tipo,
          description: descricao,
        }
        const client = await this.createTransaction.execute(payload)

        const result = {
          limite: client.limite,
          saldo: client.balance,
        }
        return response.status(200).json(result)
      },
    )
  }
}
