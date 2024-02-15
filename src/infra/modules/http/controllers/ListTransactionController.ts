import 'reflect-metadata'

import { Request, Response, Server } from 'hyper-express'
import { inject, injectable } from 'inversify'
import ListTransaction from '../../../../usecases/ListTransaction'
import { IController } from '../../../interfaces/IController'
import TYPES from '../../../server/Types'
import { ListTransactionSchema } from './schemas/ListTransactionSchema'
import Validator from '../../../utils/validator'
import { ValidateFunction } from 'ajv'

@injectable()
export default class ListTransactionController implements IController {
  private schema: ValidateFunction
  constructor(
    @inject(TYPES.ListTransaction) private listTransaction: ListTransaction,
  ) {
    this.schema = Validator.schema(ListTransactionSchema)
  }

  async execute(httpInstance: Server): Promise<Server> {
    return httpInstance.get(
      '/clientes/:client_id/extrato',
      async (request: Request, response: Response) => {
        const params = { client_id: +request.path_parameters.client_id }

        Validator.validate(this.schema, params)

        const data = await this.listTransaction.execute(params)

        const result = {
          saldo: {
            total: data[0]?.balance,
            data_extrato: new Date().toISOString(),
            limite: data[0]?.limite,
          },
          ultimas_transacoes: data
            ?.filter((item) => item.amount)
            .map((obj) => {
              return {
                valor: obj?.amount,
                tipo: obj?.type,
                descricao: obj?.description,
                realizada_em: obj?.created_at
                  ? new Date(obj.created_at).toISOString()
                  : null,
              }
            }),
        }
        return response.status(200).json(result)
      },
    )
  }
}
