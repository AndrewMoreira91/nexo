import { addDays, format, subDays } from "date-fns";
import { eachDayOfInterval } from "date-fns/fp";
import { and, asc, eq, gt } from "drizzle-orm";
import { db } from "../../drizzle";
import { dailyProgress } from "../../drizzle/schemas/daily-progress-schema";
import { CustomError } from "../../errors/CustomError";
import { dateNow } from "../../helpers/getDate";
import { findUserById } from "../user/get-user";

type ResultType = {
	[key: string]: {
		id: string;
		date: string;
		isGoalComplete: boolean;
		sessionsCompleted: number;
		totalSessionFocusDuration: number;
		streak: number;
	};
};

type queryType = {
	previousDaysCount?: number;
};

export const getDatasProgress = async (
	userId: string,
	{ previousDaysCount = 0 }: queryType,
) => {
	try {
		await findUserById(userId);

		const formattedDateToday = format(dateNow, "yyyy-MM-dd");

		const previousDateFromDays = format(
			subDays(dateNow, previousDaysCount),
			"yyyy-MM-dd",
		);

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
					previousDaysCount < 0
						? undefined
						: previousDateFromDays !== formattedDateToday
							? gt(dailyProgress.date, previousDateFromDays)
							: eq(dailyProgress.date, formattedDateToday),
				),
			)
			.orderBy(asc(dailyProgress.date));

		const result: ResultType = {};
		let oldDate: string | undefined;

		dailyProgressData.forEach((data, i) => {
			if (
				i === dailyProgressData.length - 1 &&
				data.date !== previousDateFromDays
			) {
				if (data.date >= previousDateFromDays) {
					fillMissingResultDates(previousDateFromDays, data.date);
				}
				fillMissingResultDates(data.date, formattedDateToday);
			}

			if (oldDate === undefined) {
				result[data.date] = data;
				oldDate = data.date;
				return;
			}

			const dateRange = fillMissingResultDates(oldDate, data.date);

			if (i === dateRange.length - 1 && data.date !== formattedDateToday) {
				fillMissingResultDates(data.date, addDays(formattedDateToday, 1), {
					withSlice: false,
				});
			}

			result[data.date] = data;

			type OptionsType = {
				withSlice: boolean;
			};

			function fillMissingResultDates(
				startDate: string | Date,
				endDate: string | Date,
				{ withSlice }: OptionsType = { withSlice: true },
			) {
				const dateInterval = eachDayOfInterval({
					start: startDate,
					end: endDate,
				});
				if (withSlice) {
					dateInterval.splice(0, 1);
				}
				for (const date of dateInterval) {
					const formattedDate = format(date, "yyyy-MM-dd");

					if (result[formattedDate] === undefined) {
						result[formattedDate] = {
							id: data.id,
							date: formattedDate,
							isGoalComplete: false,
							sessionsCompleted: 0,
							totalSessionFocusDuration: 0,
							streak: 0,
						};
					}
				}

				return dateInterval;
			}
		});

		return {
			result: Object.values(result),
		};
	} catch (error) {
		if (error instanceof CustomError) throw error;
		throw new CustomError("Erro ao buscar os dados de progresso", 500);
	}
};
