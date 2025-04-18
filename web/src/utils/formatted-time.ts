export const formattedTime = (timeInSeconds: number) => {
	const totalMinutes = Math.floor(timeInSeconds / 60);
	const totalHours = Math.floor(totalMinutes / 60);
	return `
		${totalHours === 0 ? "" : `${totalHours}h`}
		${totalMinutes % 60 < 10 ? "0" : ""}${totalMinutes % 60 === 0 ? "" : totalMinutes % 60}min
		`;
};
