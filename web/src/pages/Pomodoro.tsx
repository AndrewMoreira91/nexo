import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { FaClock, FaFireAlt, FaPause, FaPlay } from "react-icons/fa";
import { FiTarget } from "react-icons/fi";
import { GrPowerReset } from "react-icons/gr";
import Button from "../components/Button";
import ButtonGroup from "../components/ButtonGroup";
import Container from "../components/Container";
import Loader from "../components/Loader";
import MenuData from "../components/MenuData";
import TaskContainer from "../components/TaskContainer";
import { useAuth } from "../context/auth.context";
import { api } from "../libs/api";
import { getDataProgress } from "../services/data-service";
import type { DataProgressType, UserType } from "../types";
import { calculateProgress } from "../utils/calculateProgress";
import { timerFunction } from "../utils/timer";

type SessionType = "focus" | "shortBreak" | "longBreak";

type StartSessionResponse = {
	id: string;
	userId: string;
	dailyProgressId: string;
	duration: number;
	type: string;
	startTime: string;
	endTime: string;
	sessionEndDate: string;
};

const PomodoroPage = () => {
	const { user, isLoading: isAuthLoading } = useAuth();

	const {
		data: dataProgress,
		isLoading: isProgressLoading,
		refetch: refetchDataProgress,
	} = useQuery({
		queryKey: ["progressData"],
		queryFn: () => getDataProgress({ daysPrevious: 0 }),
		refetchOnWindowFocus: false,
	});

	const savedSession = JSON.parse(
		localStorage.getItem("currentSession") || "{}",
	);

	const [timeLeft, setTimeLeft] = useState<number>(savedSession?.timeLeft || 0);
	const [sessionDuration, setSessionDuration] = useState<number>(
		savedSession?.timeDuration || 0,
	);
	const [currentMode, setCurrentMode] = useState<SessionType>(
		savedSession?.type || "focus",
	);
	const [isTimerRunning, setIsTimerRunning] = useState(false);

	const { startTimer, stopTimer } = timerFunction({
		duration: timeLeft,
		onTick: handleTimerTick,
		onComplete: (accumulatedTime) => handleSessionComplete(accumulatedTime),
	});

	async function toggleTimer() {
		try {
			if (isTimerRunning) {
				stopTimer();
				setIsTimerRunning(false);
				return;
			}

			const response = await api.post<StartSessionResponse>("start-session", {
				type: currentMode,
			});

			localStorage.setItem("sessionId", response.data.id);
			setIsTimerRunning(true);
			startTimer();

			refetchDataProgress();
		} catch (error) {
			console.error("Error starting session:", error);
		}
	}

	function handleTimerTick(remainingTime: number) {
		setTimeLeft(remainingTime);
		if (remainingTime > 0) {
			setSessionDuration((prev) => prev + 1);
		}
	}

	async function handleSessionComplete(accumulatedTime: number) {
		setIsTimerRunning(false);
		stopTimer();

		try {
			const sessionId = localStorage.getItem("sessionId");
			if (sessionId) {
				await api.put("end-session", {
					sessionId,
					duration: accumulatedTime,
				});
			}

			refetchDataProgress();
			localStorage.removeItem("sessionId");

			if (currentMode === "focus") {
				return handleFocusSessionComplete();
			}

			resetSession("focus");
		} catch (error) {
			console.error("Error finalizing session:", error);
		}
	}

	function handleFocusSessionComplete() {
		const completedFocusSessions =
			Number(localStorage.getItem("completedFocusSessions")) || 0;

		if (completedFocusSessions === 2) {
			resetSession("longBreak");
			localStorage.setItem("completedFocusSessions", JSON.stringify(0));
		} else {
			resetSession("shortBreak");
			localStorage.setItem(
				"completedFocusSessions",
				JSON.stringify(completedFocusSessions + 1),
			);
		}
	}

	function resetSession(mode: SessionType) {
		setCurrentMode(mode);
		updateTimeLeft(mode);
		setSessionDuration(0);
	}

	function handleModeChange(selectedMode: string) {
		const mode = selectedMode as SessionType;
		resetSession(mode);
	}

	function handleResetClick() {
		stopTimer();
		resetSession(currentMode);
		setIsTimerRunning(false);
	}

	const updateTimeLeft = useCallback(
		(mode: SessionType) => {
			if (!user) return;

			const durations = {
				focus: user.focusSessionDuration,
				shortBreak: user.shortBreakSessionDuration,
				longBreak: user.longBreakSessionDuration,
			};

			setTimeLeft(durations[mode]);
		},
		[user],
	);

	const saveCurrentSession = useCallback(() => {
		localStorage.setItem(
			"currentSession",
			JSON.stringify({
				timeLeft,
				sessionDuration,
				type: currentMode,
			}),
		);
	}, [timeLeft, sessionDuration, currentMode]);

	useEffect(() => {
		saveCurrentSession();
	}, [saveCurrentSession]);

	useEffect(() => {
		if (timeLeft === 0 && !isTimerRunning) {
			updateTimeLeft(currentMode);
		}
	}, [timeLeft, isTimerRunning, currentMode, updateTimeLeft]);

	return (
		<>
			{isAuthLoading ? (
				<Loader />
			) : (
				<main className={`flex flex-col px-6 sm:px-16 gap-12 ${currentMode}`}>
					<section className="w-full p-4 flex flex-col gap-5 items-center bg-primary-bg py-6 rounded-lg">
						<SessionHeader mode={currentMode} timeLeft={timeLeft} />

						<div className="flex flex-row gap-4">
							<Button
								className="rounded-lg"
								type="button"
								size="large"
								onClick={toggleTimer}
							>
								{isTimerRunning ? (
									<FaPause className="text-xl" />
								) : (
									<FaPlay className="text-xl" />
								)}
								{isTimerRunning ? "Pausar" : "Iniciar"}
							</Button>

							<Button
								className="rounded-lg"
								type="button"
								theme="outline-secondary"
								size="large"
								onClick={handleResetClick}
							>
								<GrPowerReset className="text-xl" />
								Reiniciar
							</Button>
						</div>

						<ButtonGroup
							keys={["focus", "shortBreak", "longBreak"]}
							values={["Pomodoro", "Pausa Curta", "Pausa Longa"]}
							selectedValue={currentMode}
							onValueSelect={handleModeChange}
							disableDeselection={isTimerRunning}
						/>
					</section>

					<Container className="flex flex-col sm:flex-row justify-between gap-6 sm:gap-8">
						{renderProgressData(dataProgress, isProgressLoading, user)}
					</Container>

					<Container className="flex flex-col gap-4">
						<TaskContainer />
					</Container>
				</main>
			)}
		</>
	);
};

function SessionHeader({
	mode,
	timeLeft,
}: { mode: SessionType; timeLeft: number }) {
	const modeTitles = {
		focus: "Sessão de Foco",
		shortBreak: "Pausa Curta",
		longBreak: "Pausa Longa",
	};

	const modeDescriptions = {
		focus: "Mantenha o foco, você está progredindo a cada minuto",
		shortBreak: "Aproveite para fazer um lanche ou tomar uma água",
		longBreak: "Aproveite para descansar e relaxar",
	};

	return (
		<>
			<h3 className="font-bold text-3xl">{modeTitles[mode]}</h3>
			<span className="font-medium text-xl text-gray-500 text-center">
				{modeDescriptions[mode]}
			</span>
			<span className="font-bold text-8xl text-primary">
				{`${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? "0" : ""}${timeLeft % 60}`}
			</span>
		</>
	);
}

function renderProgressData(
	dataProgress: DataProgressType[] | null | undefined,
	isLoading: boolean,
	user: UserType | null,
) {
	if (!dataProgress?.length && !isLoading) {
		return (
			<div className="flex flex-col gap-4">
				<span className="font-bold text-2xl">Você não tem dados ainda</span>
				<span className="font-medium text-lg text-gray-500">
					Comece uma sessão para começar a acompanhar seu progresso
				</span>
			</div>
		);
	}

	return (
		<>
			<MenuData
				isLoading={isLoading}
				title="Sessão Atual"
				textMain={`${(dataProgress?.[0]?.sessionsCompleted ?? 0) + 1}/${user?.dailySessionTarget ?? 0}`}
				description="Pomodoros"
			>
				<FaClock className="text-primary text-4xl" />
			</MenuData>
			<MenuData
				isLoading={isLoading}
				title="Meta Diária"
				textMain={`${calculateProgress(dataProgress?.[0]?.sessionsCompleted ?? 0, user?.dailySessionTarget ?? 0)}%`}
				description="Completada"
			>
				<FiTarget className="text-primary text-4xl" />
			</MenuData>
			<MenuData
				isLoading={isLoading}
				title="Streak"
				textMain={`${dataProgress?.[0]?.streak ?? 0} ${
					dataProgress?.[0]?.streak === 1 ? "dia" : "dias"
				}`}
				description="Consecutivos"
			>
				<FaFireAlt className="text-primary text-4xl" />
			</MenuData>
		</>
	);
}

export default PomodoroPage;
