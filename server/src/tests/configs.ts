const dateToday = new Date();

export const dateTodayTest = new Date(
	2026, //Year
	1 - 1, //Month (0-11) - 1
	5, //Day (1-31)
	dateToday.getHours(),
	dateToday.getMinutes(),
	dateToday.getSeconds(),
);
