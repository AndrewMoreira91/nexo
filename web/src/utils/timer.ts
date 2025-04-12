let timer: number | null = null

export function startTimer(
	onTick: () => void,
) {
	if (timer) clearInterval(timer)

	timer = setInterval(() => {
		onTick()
	}, 1000)
}

export function stopTimer() {
	if (timer) {
		clearInterval(timer)
		timer = null
	}
}