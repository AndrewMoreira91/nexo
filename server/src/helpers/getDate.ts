import { dateTodayTest } from '../tests/configs'
import { isDevelopment } from '../utils/chose-environment'

export const dateNow =
  isDevelopment() ? dateTodayTest : new Date()
