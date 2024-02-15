import * as HyperExpress from 'hyper-express'
import { Request, Response } from 'hyper-express'
import { Container, injectable } from 'inversify'
import 'reflect-metadata'
import NoutFoundException from '../../../domain/exceptions/NotFoundException'
import UnprocessableEntityException from '../../../domain/exceptions/UnprocessableEntityException'
import Module from '../../interfaces/IModule'
import SECRETS from '../../server/env'
import TYPES from '../../server/Types'
import CreateTransactionController from './controllers/CreateTransactionController'
import ListTransactionController from './controllers/ListTransactionController'

@injectable()
export default class HttpModule extends Module {
  private server = new HyperExpress.Server({ trust_proxy: true })

  static async build(container: Container): Promise<HttpModule> {
    const module = new HttpModule(container)
    await module.configurations()
    return module
  }

  async start(): Promise<void> {
    this.server
      .listen(SECRETS.PORT)
      .then(() => {
        console.log(`Server listen on ${SECRETS.PORT} PORT`)
      })
      .catch(() => {
        console.log(`Failed to start Server on port ${SECRETS.PORT}`)
      })
  }

  errorHandler(_req: Request, res: Response, err: Error | any) {
    if (err instanceof NoutFoundException) return res.status(404).send()
    if (err instanceof UnprocessableEntityException)
      return res.status(422).send()
    if (err.code === '23503') return res.status(404).send()
    return res.status(500).send()
  }

  async configurations(): Promise<void> {
    this.container
      .bind(TYPES.ListTransactionController)
      .to(ListTransactionController)
    this.container
      .bind(TYPES.CreateTransactionController)
      .to(CreateTransactionController)

    const listTransactionController =
      this.container.get<ListTransactionController>(
        TYPES.ListTransactionController,
      )
    const createTransactionController =
      this.container.get<CreateTransactionController>(
        TYPES.CreateTransactionController,
      )

    listTransactionController.execute(this.server)
    createTransactionController.execute(this.server)

    this.server.set_error_handler(this.errorHandler)
  }
}
