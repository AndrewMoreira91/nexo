let interval: number | null = null;

self.onmessage = (event) => {
	if (event.data.type === "start") {
		const { duration } = event.data;
		let elapsedTime = 0;

		interval = setInterval(() => {
			console.log("Worker interval tick");
			elapsedTime++;
			const remainingTime = duration - elapsedTime;

			if (remainingTime > 0) {
				self.postMessage({ type: "tick", remaining: remainingTime });
			} else {
				if (interval) {
					clearInterval(interval);
				}
				self.postMessage({
					type: "complete",
					accumulatedTime: Math.abs(remainingTime),
				});
				self.close();
			}
		}, 1000) as unknown as number;
	} else if (event.data.type === "stop") {
		if (interval) {
			clearInterval(interval);
		}
		self.close();
	}
};
