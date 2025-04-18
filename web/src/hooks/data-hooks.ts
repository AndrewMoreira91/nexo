import { useQuery } from "@tanstack/react-query";
import { getDataProgressToday } from "../services/data-service";

export const useFetchDataProgress = () => {
	return useQuery({
		queryKey: ["dataProgress"],
		queryFn: getDataProgressToday,
	});
};
