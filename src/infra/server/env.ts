import env from 'env-var'
export default {
  mode: env.get('NODE_ENV').default('development').asString(),
  PORT: env.get('PORT').required().asPortNumber(),
  IS_PRIMARY_NODE: env.get('IS_PRIMARY_NODE').required().asBool(),
  UV_THREADPOOL_SIZE: env.get('UV_THREADPOOL_SIZE').required().asInt(),
} as const
