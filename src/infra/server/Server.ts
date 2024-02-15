import 'reflect-metadata'
import { Container } from 'inversify'
import HttpModule from '../modules/http/HttpModule'
import SQLModule from '../modules/sql/SQLModule'
import IoC from './IoC'
import TYPES from './Types'
import SECRETS from '../server/env'

process.env.UV_THREADPOOL_SIZE = String(SECRETS.UV_THREADPOOL_SIZE)

async function run(): Promise<void> {
  const ioc = new IoC()
  await ioc.build()

  const container = ioc.getContainer()
  container.bind<Container>(TYPES.Container).toConstantValue(container)

  const sqlInstance = await SQLModule.build(ioc.getContainer())
  await sqlInstance.start()

  const httpInstance = await HttpModule.build(ioc.getContainer())
  await httpInstance.start()
}
;(async () => {
  await run()
})()
