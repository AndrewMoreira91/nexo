import { api } from "../libs/api";
import type { DataProgressType } from "../types";

export const getDataProgressToday = async () => {
	const response = await api.get<DataProgressType[]>("/get-data-progress");
	return response.data;
};
