import { addDays, format, subDays } from 'date-fns'
import { eachDayOfInterval } from 'date-fns/fp'
import { and, asc, eq, gt } from 'drizzle-orm'
import { db } from '../../drizzle'
import { dailyProgress } from '../../drizzle/schemas/daily-progress-schema'
import { dateNow } from '../../helpers/getDate'

type ResultType = {
	[key: string]: {
		date: string
		isGoalComplete: boolean
		sessionsCompleted: number
		totalSessionFocusDuration: number
		streak: number
	}
}

type queryType = {
	daysPrevious?: number
}

export const getDatasProgress = async (
	userId: string,
	{ daysPrevious = 0 }: queryType,
) => {
	try {
		const formattedDateToday = format(dateNow, 'yyyy-MM-dd')

		const previousDateFromDays = format(
			subDays(dateNow, daysPrevious),
			'yyyy-MM-dd',
		)

		const dailyProgressData = await db
			.select({
				date: dailyProgress.date,
				isGoalComplete: dailyProgress.isGoalComplete,
				sessionsCompleted: dailyProgress.sessionsCompleted,
				totalSessionFocusDuration: dailyProgress.totalSessionFocusDuration,
				streak: dailyProgress.streak,
			})
			.from(dailyProgress)
			.where(
				and(
					eq(dailyProgress.userId, userId),
					daysPrevious < 0
						? undefined
						: previousDateFromDays !== formattedDateToday
							? gt(dailyProgress.date, previousDateFromDays)
							: eq(dailyProgress.date, formattedDateToday),
				),
			)
			.orderBy(asc(dailyProgress.date))

		const result: ResultType = {}
		let oldDate: string | undefined

		dailyProgressData.forEach((data, i) => {
			if (
				i === dailyProgressData.length - 1 &&
				data.date !== previousDateFromDays
			) {
				if (data.date >= previousDateFromDays) {
					fillMissingResultDates(previousDateFromDays, data.date)
				}
				fillMissingResultDates(data.date, formattedDateToday)
			}

			if (oldDate === undefined) {
				result[data.date] = data
				oldDate = data.date
				return
			}

			const dateRange = fillMissingResultDates(oldDate, data.date)

			if (i === dateRange.length - 1 && data.date !== formattedDateToday) {
				fillMissingResultDates(data.date, addDays(formattedDateToday, 1), {
					withSlice: false,
				})
			}

			result[data.date] = data

			type OptionsType = {
				withSlice: boolean
			}

			function fillMissingResultDates(
				startDate: string | Date,
				endDate: string | Date,
				{ withSlice }: OptionsType = { withSlice: true },
			) {
				const dateInterval = eachDayOfInterval({
					start: startDate,
					end: endDate,
				})
				if (withSlice) {
					dateInterval.splice(0, 1)
				}
				for (const date of dateInterval) {
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
				}

				return dateInterval
			}
		})

		return {
			result: Object.values(result),
		}
	} catch (error) {
		console.error('Error in getDatasProgress:', error)
		throw new Error(String(error))
	}
}
