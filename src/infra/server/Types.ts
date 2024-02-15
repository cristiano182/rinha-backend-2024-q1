const TYPES = {
  Container: Symbol.for('Container'),

  CreateTransaction: Symbol.for('CreateTransaction'),
  ListTransaction: Symbol.for('ListTransaction'),

  ClientRepository: Symbol.for('ClientRepository'),

  CreateTransactionController: Symbol.for('CreateTransactionController'),
  ListTransactionController: Symbol.for('ListTransactionController'),

  SQLModuleConnection: Symbol.for('SQLModuleConnection'),
}

export default TYPES
