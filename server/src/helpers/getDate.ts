import { env } from '../env'
import { dateTodayTest } from '../tests/configs'

export const dateNow =
  env.ENVIRONMENT === 'development' ? dateTodayTest : new Date()
