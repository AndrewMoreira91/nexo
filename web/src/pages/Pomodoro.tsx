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
import { calculateProgress } from "../utils/calculateProgress";
import { startTimer, stopTimer } from "../utils/timer";

type SessionsType = "focus" | "shortBreak" | "longBreak";
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
	const { user, isLoading } = useAuth();

	const {
		data: dataProgress,
		isLoading: loadingDataProgress,
		refetch: dataProgressRefetch,
	} = useQuery({
		queryKey: ["dataProgress"],
		queryFn: () => getDataProgress({ daysPrevious: 0 }),
		refetchOnWindowFocus: false,
	});

	const currentSession:
		| { timeDuration: number; timeLeft: number; type: SessionsType }
		| undefined = JSON.parse(localStorage.getItem("currentSession") || "{}");

	const [timeLeft, setTimeLeft] = useState<number>(
		currentSession?.timeLeft || 0,
	);
	const [timeDuration, setTimeDuration] = useState<number>(
		currentSession?.timeDuration || 0,
	);

	const [isTimerRunning, setIsTimerRunning] = useState(false);
	const [selectedMode, setSelectedMode] = useState<SessionsType>(
		currentSession?.type || "focus",
	);

	saveCurrentSession();

	function saveCurrentSession() {
		localStorage.setItem(
			"currentSession",
			JSON.stringify({
				timeLeft,
				timeDuration,
				type: selectedMode,
			}),
		);
	}

	async function toggleTimer() {
		if (isTimerRunning) {
			stopTimer();
			setIsTimerRunning(false);
			return;
		}

		const response = await api.post<StartSessionResponse>("start-session", {
			type: selectedMode as SessionsType,
		});
		localStorage.setItem("sessionId", response.data.id);

		setIsTimerRunning(true);

		startTimer(() => {
			setTimeDuration((prevTimeDuration) => {
				return prevTimeDuration + 1;
			});

			setTimeLeft((prevTimeLeft) => {
				if (prevTimeLeft === 0) {
					finalizeSession();
					return 0;
				}
				return prevTimeLeft - 1;
			});
		});
	}

	async function finalizeSession() {
		setIsTimerRunning(false);
		stopTimer();
		try {
			if (!isTimerRunning) {
				const currentSession:
					| { timeDuration: number; timeLeft: number; type: SessionsType }
					| undefined = JSON.parse(localStorage.getItem("currentSession") || "{}")

				const sessionId = localStorage.getItem("sessionId");
				if (sessionId) {
					await api.put("end-session", {
						sessionId,
						duration: currentSession?.timeDuration,
					});
				}

				dataProgressRefetch();

				localStorage.removeItem("sessionId");

				if (selectedMode === "focus") {
					const sessionFocusConcluded =
						Number(localStorage.getItem("sessionsFocusConcluded")) || 0;

					console.log(sessionFocusConcluded);

					if (sessionFocusConcluded === 2) {
						setSelectedMode("longBreak");
						changeTimeLeft("longBreak");
						localStorage.setItem(
							"sessionsFocusConcluded",
							JSON.stringify(0),
						);
					} else {
						setSelectedMode("shortBreak");
						changeTimeLeft("shortBreak");
						localStorage.setItem(
							"sessionsFocusConcluded",
							JSON.stringify(sessionFocusConcluded + 1),
						);
					}
				}

				setSelectedMode("focus");
				changeTimeLeft("focus");
				setTimeDuration(0);
			}
		} catch (error) {
			console.error("Error finalizing session:", error);
		}
	}

	function handleModeChange(value: string) {
		const mode = value as SessionsType;
		setSelectedMode(mode);
		changeTimeLeft(mode);
		setTimeDuration(0);
	}

	function handleClickReset() {
		stopTimer();
		setTimeDuration(0);
		setIsTimerRunning(false);
		changeTimeLeft(selectedMode);
	}

	const changeTimeLeft = useCallback(
		(mode: SessionsType) => {
			if (!user) return null;
			if (mode === "focus") {
				setTimeLeft(user?.focusSessionDuration);
			} else if (mode === "shortBreak") {
				setTimeLeft(user?.shortBreakSessionDuration);
			} else if (mode === "longBreak") {
				setTimeLeft(user?.longBreakSessionDuration);
			}
		},
		[user],
	);

	useEffect(() => {
		if (timeLeft === 0 && !isTimerRunning) {
			changeTimeLeft(selectedMode);
		}
	}, [changeTimeLeft, timeLeft, selectedMode, isTimerRunning]);

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<main className={`flex flex-col px-6 sm:px-16 gap-12 ${selectedMode}`}>
					<section className="w-full p-4 flex flex-col gap-5 items-center bg-primary-bg py-6 rounded-lg">
						{selectedMode === "focus" && (
							<>
								<h3 className="font-bold text-3xl">Sessão de foco</h3>
								<span className="font-medium text-xl text-gray-500 text-center">
									Mantenha o foco, você está progredindo a cada minuto
								</span>
							</>
						)}
						{selectedMode === "shortBreak" && (
							<>
								<h3 className="font-bold text-3xl">Pausa curta</h3>
								<span className="font-medium text-xl text-gray-500 text-center">
									Aproveite para fazer um lanche ou tomar uma água
								</span>
							</>
						)}
						{selectedMode === "longBreak" && (
							<>
								<h3 className="font-bold text-3xl">Pausa longa</h3>
								<span className="font-medium text-xl text-gray-500 text-center">
									Aproveite para descansar e relaxar
								</span>
							</>
						)}

						<span className="font-bold text-8xl text-primary">
							{`${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? "0" : ""}${timeLeft % 60}`}
						</span>

						<div className="flex flex-row gap-4">
							<Button
								className="rounded-lg"
								type="button"
								size="large"
								onClick={() => toggleTimer()}
							>
								{isTimerRunning ? (
									<FaPause className="text-xl" />
								) : (
									<FaPlay className="text-xl" />
								)}
								Iniciar
							</Button>
							<Button
								className="rounded-lg"
								type="button"
								theme="outline-secondary"
								size="large"
								onClick={handleClickReset}
							>
								<GrPowerReset className="text-xl" />
								Reiniciar
							</Button>
						</div>

						<ButtonGroup
							keys={["focus", "shortBreak", "longBreak"]}
							values={["pomodoro", "pausa curta", "pausa longa"]}
							selectedValue={selectedMode}
							onValueSelect={handleModeChange}
							disableDeselection={isTimerRunning}
						/>
					</section>

					<Container className="flex flex-col sm:flex-row justify-between gap-6 sm:gap-8">
						{(dataProgress?.length === 0 || dataProgress === null) &&
							!loadingDataProgress && (
								<div className="flex flex-col gap-4">
									<span className="font-bold text-2xl">
										Você não tem dados ainda
									</span>
									<span className="font-medium text-lg text-gray-500">
										Complete uma sessão para começar a acompanhar seu progresso
									</span>
								</div>
							)}
						{dataProgress !== null && (
							<>
								<MenuData
									isLoading={loadingDataProgress}
									title="Sessão atual"
									textMain={`
								${(dataProgress?.[0]?.sessionsCompleted ?? 0) + 1}/${user?.dailySessionTarget ?? 0}
							`}
									description="Pomodoros"
								>
									<FaClock className="text-primary text-4xl" />
								</MenuData>
								<MenuData
									isLoading={loadingDataProgress}
									title="Meta diária"
									textMain={`
								${calculateProgress(dataProgress?.[0]?.sessionsCompleted ?? 0, user?.dailySessionTarget ?? 0)}%
							`}
									description="Completada"
								>
									<FiTarget className="text-primary text-4xl" />
								</MenuData>
								<MenuData
									isLoading={loadingDataProgress}
									title="Streak"
									textMain={`
									${dataProgress?.[0].streak ?? 0}
									${dataProgress?.[0].streak === 1 ? "dia" : "dias"}
									`}
									description="Consecutivos"
								>
									<FaFireAlt className="text-primary text-4xl" />
								</MenuData>
							</>
						)}
					</Container>

					<Container className="flex flex-col gap-4">
						<TaskContainer />
					</Container>
				</main>
			)}
		</>
	);
};

export default PomodoroPage;
