import 'reflect-metadata'
import { Container, injectable } from 'inversify'
import Module from '../../interfaces/IModule'
import TYPES from '../../server/Types'
import ClientRepository from '../sql/repositories/ClientRepository'
import pool from './configs/config'
import { PoolClient } from 'pg'
import seed from './configs/seed'
import cluster from 'cluster'
import SECRETS from '../../server/env'

@injectable()
export default class MongoDBModule extends Module {
  static async build(container: Container): Promise<MongoDBModule> {
    const module = new MongoDBModule(container)
    await module.configurations()
    return module
  }

  async stop(): Promise<void> {
    await pool.end()
  }

  async configurations(): Promise<void> {
    if (cluster.isPrimary && SECRETS.IS_PRIMARY_NODE) await seed(pool)
    const poolClient = await pool.connect()
    this.container
      .bind<PoolClient>(TYPES.SQLModuleConnection)
      .toConstantValue(poolClient)
    return
  }
  async start(): Promise<void> {
    this.container.bind(TYPES.ClientRepository).to(ClientRepository)
  }
}
