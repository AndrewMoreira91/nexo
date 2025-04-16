import { useCallback, useEffect, useState } from "react";
import { FaClock, FaFireAlt, FaPause, FaPlay } from "react-icons/fa";
import { FiTarget } from "react-icons/fi";
import { GrPowerReset } from "react-icons/gr";
import Button from "../components/Button";
import ButtonGroup from "../components/ButtonGroup";
import Container from "../components/Conteiner";
import Loader from "../components/Loader";
import MenuData from "../components/MenuData";
import TaskContainer from "../components/TaskContainer";
import { useAuth } from "../context/auth.context";
import { startTimer, stopTimer } from "../utils/timer";

type ModesType = "focus" | "shortBreak" | "longBreak";

const PomodoroPage = () => {
	const { user, isLoading } = useAuth();
	const [selectedMode, setSelectedMode] = useState<ModesType>("focus");
	const [timeLeft, setTimeLeft] = useState<number>(0);
	const [isTimerRunning, setIsTimerRunning] = useState(false);

	function toggleTimer() {
		if (isTimerRunning) {
			stopTimer();
			setIsTimerRunning(false);
			return;
		}

		setIsTimerRunning(true);

		startTimer(() => {
			setTimeLeft((prevTimeLeft) => {
				if (prevTimeLeft <= 0) {
					setIsTimerRunning(false);
					return 0;
				}
				return prevTimeLeft - 1;
			});
		});
	}

	const changeTimeLeft = useCallback(() => {
		if (!user) return null;
		if (selectedMode === "focus") {
			setTimeLeft(user?.focusSessionDuration);
		} else if (selectedMode === "shortBreak") {
			setTimeLeft(user?.shortBreakSessionDuration);
		} else if (selectedMode === "longBreak") {
			setTimeLeft(user?.longBreakSessionDuration);
		}
	}, [selectedMode, user]);

	function handleClickReset() {
		stopTimer();
		setIsTimerRunning(false);
		changeTimeLeft();
	}

	useEffect(() => {
		changeTimeLeft();
	}, [changeTimeLeft]);

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
									Matenha o foco, você está progredindo a cada minuto
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
							onValueSelect={(value: string) => {
								setSelectedMode(value as ModesType);
							}}
							disableDeselection={isTimerRunning}
						/>
					</section>

					<Container className="flex flex-col sm:flex-row justify-between gap-6 sm:gap-8">
						<MenuData
							title="Sessão atual"
							textMain="2/4"
							description="Pomodoros"
						>
							<FaClock className="text-primary text-4xl" />
						</MenuData>
						<MenuData
							title="Meta diária"
							textMain="62.5%"
							description="Completada"
						>
							<FiTarget className="text-primary text-4xl" />
						</MenuData>
						<MenuData
							title="Streak"
							textMain="7 dias"
							description="Consecutivos"
						>
							<FaFireAlt className="text-primary text-4xl" />
						</MenuData>
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
