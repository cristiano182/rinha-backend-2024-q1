import { TransactionType } from '../../../../../domain/transaction/interfaces'

export const CreateTransactionSchema = {
  type: 'object',
  properties: {
    valor: { type: 'integer' },
    tipo: {
      enum: Object.values(TransactionType),
      type: 'string',
    },
    descricao: { type: 'string', minLength: 1, maxLength: 10 },
    client_id: { type: 'integer' },
  },
  required: ['descricao', 'valor', 'tipo', 'client_id'],
}
