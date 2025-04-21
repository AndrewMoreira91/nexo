type TimerConfig = {
	duration: number;
	onTick: (remaining: number) => void;
	onComplete: (accumulatedTime: number) => void;
};

type TimerResponse = {
	startTimer: () => void;
	stopTimer: () => void;
};

let worker: Worker | null = null;

export function timerFunction({
	duration,
	onTick,
	onComplete,
}: TimerConfig): TimerResponse {
	if (worker === null) {
		worker = new Worker(new URL("../works/timerWork.ts", import.meta.url));
	}

	const startTimer = () => {
		if (worker) {
			worker.onmessage = (event) => {
				const { type, remaining, accumulatedTime } = event.data;

				if (type === "tick") {
					onTick(remaining);
				} else if (type === "complete") {
					onComplete(accumulatedTime);
					stopTimer();
				}
			};

			worker.postMessage({ duration, type: "start" });
		}
	};

	const stopTimer = () => {
		if (worker) {
			worker.postMessage({ type: "stop" });
			worker = null;
		}
	};

	return { startTimer, stopTimer };
}
