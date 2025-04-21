import { format, getDay, subDays } from 'date-fns'
import { and, asc, eq, gt } from 'drizzle-orm'
import { db } from '../../drizzle'
import { dailyProgress } from '../../drizzle/schemas/daily-progress-schema'
import { tasks } from '../../drizzle/schemas/tasks-schema'
import { dateToday } from '../../helpers/getDate'

type QueryProps = {
	daysPrevious?: number
}

type TaskType = {
	id: string
	dailyProgressId: string | null
	title: string
	isCompleted: boolean
}

type ResultType = {
	totalSessionFocusDuration: number
	sessionsFocusCompleted: number
	numTasksCompleted: number
	tasksCompleted: TaskType[]
	dailyMediaDuration: number
	weeklyTrend?: number
	bestDay: {
		date: string
		timeCompleted: number
		isTargetCompleted: boolean
	}
	worstDay: {
		date: string
		timeCompleted: number
		isTargetCompleted: boolean
	}
}

export const getStatisticDatas = async (
	userId: string,
	{ daysPrevious = 0 }: QueryProps,
) => {
	const formattedDateToday = format(dateToday, 'yyyy-MM-dd')

	const previousDateFromDays = format(
		subDays(dateToday, daysPrevious),
		'yyyy-MM-dd',
	)

	const dailyProgressData = await db
		.select({
			id: dailyProgress.id,
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

	const result: ResultType = {
		totalSessionFocusDuration: 0,
		sessionsFocusCompleted: 0,
		numTasksCompleted: 0,
		tasksCompleted: [],
		dailyMediaDuration: 0,
		bestDay: {
			date: '',
			timeCompleted: 0,
			isTargetCompleted: false,
		},
		worstDay: {
			date: '',
			timeCompleted: 0,
			isTargetCompleted: false,
		},
	}

	const dayWeekTrendItens = []

	for (const dailyProgress of dailyProgressData) {
		const tasksCompleted = await db
			.select({
				id: tasks.id,
				dailyProgressId: tasks.dailyProgressId,
				title: tasks.title,
				isCompleted: tasks.isCompleted,
			})
			.from(tasks)
			.where(
				and(
					eq(tasks.userId, userId),
					eq(tasks.dailyProgressId, dailyProgress.id),
					eq(tasks.isCompleted, true),
				),
			)

		if (dailyProgress.isGoalComplete) {
			dayWeekTrendItens.push(getDay(dailyProgress.date))
		}

		result.totalSessionFocusDuration += dailyProgress.totalSessionFocusDuration
		result.sessionsFocusCompleted += dailyProgress.sessionsCompleted

		result.numTasksCompleted += tasksCompleted.length
		result.tasksCompleted.push(...tasksCompleted)

		result.dailyMediaDuration =
			result.totalSessionFocusDuration / dailyProgressData.length

		if (
			result.bestDay.timeCompleted < dailyProgress.totalSessionFocusDuration
		) {
			result.bestDay.date = format(dailyProgress.date, 'yyyy-MM-dd')
			result.bestDay.timeCompleted = dailyProgress.totalSessionFocusDuration
			result.bestDay.isTargetCompleted = dailyProgress.isGoalComplete
		}

		if (
			result.bestDay.timeCompleted > dailyProgress.totalSessionFocusDuration
		) {
			result.worstDay.date = format(dailyProgress.date, 'yyyy-MM-dd')
			result.worstDay.timeCompleted = dailyProgress.totalSessionFocusDuration
			result.worstDay.isTargetCompleted = dailyProgress.isGoalComplete
		}
	}

	let weeklyTrend = 0
	const countedDays: { [key: number]: number } = {}
	let highestCount = 0

	for (const item of dayWeekTrendItens) {
		countedDays[item] = (countedDays[item] || 0) + 1

		if (countedDays[item] > highestCount) {
			highestCount = countedDays[item]
			weeklyTrend = item
		}
	}
	result.weeklyTrend = weeklyTrend

	return { result }
}
