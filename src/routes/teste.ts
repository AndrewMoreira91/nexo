import { addDays, format } from 'date-fns'
import { eachDayOfInterval } from 'date-fns/fp'
import { asc, eq, sql } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from '../drizzle'
import { dailyProgress } from '../drizzle/schemas/daily-progress-schema'
import { dateToday } from '../utils/getDate'

export const testeRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		'/teste',
		{
			schema: {
				summary: 'Rota de teste',
				tags: ['testes'],
				// body: z.object({
				// 	name: z.string().nonempty(),
				// 	email: z.string().email(),
				// 	password: z.string().min(6),
				// }),
				// response: {
				// 	201: z.object({
				// 		id: z.string(),
				// 		name: z.string(),
				// 		email: z.string(),
				// 		dailySessionTarget: z.number(),
				// 	})
				// }
			},
		},
		async () => {
			type ResultType = {
				[key: string]: {
					date: string
					isGoalComplete: boolean
					sessionsCompleted: number
					totalSessionFocusDuration: number
					streak: number
				}
			}
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
				.where(eq(dailyProgress.userId, 'bb6eb0d9-3a5d-4ea5-997e-3da9a1d9b481'))
				.orderBy(asc(dailyProgress.date))

			const result: ResultType = {}
			let oldDate: string | undefined

			dailyProgressData.forEach((data, i) => {
				console.log('Index', i)

				if (oldDate === undefined) {
					console.log('First data', data)
					result[data.date] = data
					oldDate = data.date
					return
				}

				console.log('Old date', oldDate)
				console.log('Data date', data.date)

				const interval = eachDayOfInterval({
					start: oldDate,
					end: data.date,
				})

				interval.splice(0, 1)

				console.log('Interval', interval)

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
					console.log('Last data', data)
					console.log('Formatted date today', formattedDateToday)

					const interval = eachDayOfInterval({
						start: data.date,
						end: addDays(formattedDateToday, 1),
					})

					console.log('Last interval', interval)

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

			console.log('Result', result)
		},
	)
}
