import { Server } from 'hyper-express'

export interface IController {
  execute: (httpInstance: Server) => Promise<Server>
}
