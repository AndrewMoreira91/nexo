const dateToday = new Date();

export const dateTodayTest = new Date(
	2025, //Year
	11 - 1, //Month (0-11) - 1
	29, //Day (1-31)
	dateToday.getHours(),
	dateToday.getMinutes(),
	dateToday.getSeconds(),
);
