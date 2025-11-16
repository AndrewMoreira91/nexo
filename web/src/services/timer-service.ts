type TimerCallback = {
	onTick?: (remaining: number) => void
	onComplete?: () => void
}

class TimerService {
	private worker: Worker | null = null
	private callbacks: TimerCallback = {}
	private isRunning = false

	constructor() {
		this.initWorker()
	}

	private initWorker() {
		if (!this.worker) {
			this.worker = new Worker(
				new URL('../works/timer-work.ts', import.meta.url)
			)

			this.worker.onmessage = event => {
				const { type, remaining } = event.data

				console.log(remaining)

				if (type === 'tick') {
					this.callbacks.onTick?.(remaining)
				} else if (type === 'complete') {
					this.isRunning = false
					this.callbacks.onComplete?.()
				}
			}
		}
	}

	start(duration: number, callbacks: TimerCallback) {
		this.callbacks = callbacks
		this.isRunning = true

		if (!this.worker) {
			this.initWorker()
		}

		this.worker?.postMessage({ duration, type: 'start' })
	}

	stop() {
		this.isRunning = false
		this.worker?.postMessage({ type: 'stop' })
	}

	setCallbacks(callbacks: TimerCallback) {
		this.callbacks = callbacks
	}

	getIsRunning(): boolean {
		return this.isRunning
	}

	// Optional: method to completely destroy the worker if needed
	destroy() {
		if (this.worker) {
			this.worker.terminate()
			this.worker = null
		}
		this.isRunning = false
		this.callbacks = {}
	}
}

// Create a singleton instance
export const timerService = new TimerService()
