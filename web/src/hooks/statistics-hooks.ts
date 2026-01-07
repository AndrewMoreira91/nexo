import { useQuery } from "@tanstack/react-query";
import { api } from "../libs/api";
import { getDataProgress, getDataStatistics } from "../services/data-service";
import type { DataProgressType } from "../types";

type QueryOptions = {
	daysPrevious?: number;
	enabled?: boolean;
};

export const useStatisticsData = ({ daysPrevious = 30, enabled = true }: QueryOptions = {}) => {
	const { data: dataProgress, isLoading: isLoadingProgress, error: errorProgress } = useQuery({
		queryKey: ["dataProgress", "statistics", daysPrevious],
		queryFn: () => getDataProgress({ daysPrevious }),
		refetchOnWindowFocus: false,
		enabled,
	});

	const { data: dataStatistics, isLoading: isLoadingStatistics, error: errorStatistics } = useQuery({
		queryKey: ["dataStatistics", daysPrevious],
		queryFn: () => getDataStatistics({ daysPrevious }),
		refetchOnWindowFocus: false,
		enabled,
	});

	const { data: apiDate, isLoading: isLoadingDate } = useQuery({
		queryKey: ["dateApi"],
		queryFn: async () => {
			const response = await api<{ date: Date }>("/date");
			return response.data;
		},
		refetchOnWindowFocus: false,
		enabled,
	});

	const dateToday =
		import.meta.env.VITE_ENV === "development" && apiDate?.date
			? apiDate.date
			: new Date();

	return {
		dataProgress: dataProgress || [],
		dataStatistics,
		dateToday,
		isLoading: isLoadingProgress || isLoadingStatistics || isLoadingDate,
		errors: {
			progress: errorProgress,
			statistics: errorStatistics,
		},
	};
};

export const useChartData = (dataProgress: DataProgressType[]) => {
	interface ChartDataPoint {
		date: string;
		time: number;
		completed: number;
		notCompleted: number;
		sessions: number;
	}

	const chartData: ChartDataPoint[] = (dataProgress || []).map((item) => ({
		date: new Date(item.date).toLocaleDateString("pt-BR", {
			day: "2-digit",
			month: "short",
		}),
		time: Math.round(item.totalSessionFocusDuration / 60),
		completed: item.isGoalComplete ? 1 : 0,
		notCompleted: item.isGoalComplete ? 0 : 1,
		sessions: item.sessionsCompleted,
	}));

	return chartData;
};
