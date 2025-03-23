import { addDays, format } from 'date-fns'
import { eachDayOfInterval } from 'date-fns/fp'
import { asc, eq } from 'drizzle-orm'
import { db } from '../../drizzle'
import { dailyProgress } from '../../drizzle/schemas/daily-progress-schema'
import { dateToday } from '../../utils/getDate'
import { getUser } from '../user/get-user'

type ResultType = {
	[key: string]: {
		date: string
		isGoalComplete: boolean
		sessionsCompleted: number
		totalSessionFocusDuration: number
		streak: number
	}
}

export const getDatasProgress = async (userId: string) => {
	const user = await getUser(userId)
	if (!user) throw new Error('User not found')

	const formattedDateToday = format(dateToday, 'yyyy-MM-dd')

	const dailyProgressData = await db
		.select({
			date: dailyProgress.date,
			isGoalComplete: dailyProgress.isGoalComplete,
			sessionsCompleted: dailyProgress.sessionsCompleted,
			totalSessionFocusDuration: dailyProgress.totalSessionFocusDuration,
			streak: dailyProgress.streak,
		})
		.from(dailyProgress)
		.where(eq(dailyProgress.userId, userId))
		.orderBy(asc(dailyProgress.date))

	const result: ResultType = {}
	let oldDate: string | undefined

	dailyProgressData.forEach((data, i) => {
		if (oldDate === undefined) {
			result[data.date] = data
			oldDate = data.date
			return
		}

		const interval = eachDayOfInterval({
			start: oldDate,
			end: data.date,
		})
		interval.splice(0, 1)

		interval.forEach((date, i) => {
			const formattedDate = format(date, 'yyyy-MM-dd')

			if (result[formattedDate] === undefined) {
				result[formattedDate] = {
					date: formattedDate,
					isGoalComplete: false,
					sessionsCompleted: 0,
					totalSessionFocusDuration: 0,
					streak: 0,
				}
			}
		})

		result[data.date] = data

		if (i === interval.length - 1 && data.date !== formattedDateToday) {
			const interval = eachDayOfInterval({
				start: data.date,
				end: addDays(formattedDateToday, 1),
			})

			interval.forEach((date, i) => {
				const formattedDate = format(date, 'yyyy-MM-dd')

				if (result[formattedDate] === undefined) {
					result[formattedDate] = {
						date: formattedDate,
						isGoalComplete: false,
						sessionsCompleted: 0,
						totalSessionFocusDuration: 0,
						streak: 0,
					}
				}
			})
		}
	})

	return {
		result: Object.values(result),
	}
}
