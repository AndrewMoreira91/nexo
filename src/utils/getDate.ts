import { env } from '../env'
import { dateTodayTest } from '../tests/configs'

export const dateToday =
	env.ENVIRONMENT === 'development' ? dateTodayTest : new Date()
