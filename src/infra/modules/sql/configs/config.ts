import env from 'env-var'
import { Pool } from 'pg'

export interface Datasource {
  connectionString: string
  max_pool: number
  min_pool: number
}

export const datasource: Datasource = {
  connectionString: env.get('POSTGRES_URL').required().asString(),
  max_pool: env.get('POSTGRES_MAX_POOL').required().asInt(),
  min_pool: env.get('POSTGRES_MIN_POOL').required().asInt(),
}

const pool = new Pool({
  connectionString: datasource.connectionString,
  min: datasource.min_pool,
  max: datasource.max_pool,
  idle_in_transaction_session_timeout: 3,
  connectionTimeoutMillis: 60_000,
  query_timeout: 60_0000,
})

export default pool
