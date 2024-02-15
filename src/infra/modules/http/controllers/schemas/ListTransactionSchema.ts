export const ListTransactionSchema = {
  type: 'object',
  properties: {
    client_id: { type: 'integer' },
  },
  required: ['client_id'],
}
