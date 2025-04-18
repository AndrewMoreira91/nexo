import { Tooltip } from "@mui/joy";
import { useEffect } from "react";
import { FaCheck, FaClock, FaFireAlt, FaPlay, FaTrophy } from "react-icons/fa";
import { useNavigate } from "react-router";
import Button from "../components/Button";
import Container from "../components/Container";
import Loader from "../components/Loader";
import MenuData from "../components/MenuData";
import Progressbar from "../components/Progressbar";
import TaskContainer from "../components/TaskContainer";
import { useAuth } from "../context/auth.context";
import { useFetchDataProgress } from "../hooks/data-hooks";
import { formattedTime } from "../utils/formatted-time";

const DashboardPage = () => {
	const { user, isLoading } = useAuth();
	const { data: dataProgress } = useFetchDataProgress();

	const navigate = useNavigate();

	const timeTotalTarget =
		(user?.dailySessionTarget ?? 0) * (user?.focusSessionDuration ?? 0);

	useEffect(() => {
		if (!user) {
			navigate("/login");
		}
	}, [user, navigate]);

	return (
		<>
			{isLoading && user === null ? (
				<Loader />
			) : (
				<main className="px-6 sm:px-16 my-12">
					<div>
						<h3 className="font-bold text-2xl sm:text-3xl">
							Bem Vindo {user?.name.split(" ").slice(0, 2).join(" ")}!
						</h3>
						<span className="font-medium text-base sm:text-xl text-gray-500">
							Vamos começar mais um dia produtivo?
						</span>
					</div>

					<div className="flex flex-col gap-8 my-12">
						<Container className="flex flex-col sm:flex-row gap-5 justify-between">
							<div className="flex flex-col gap-4 w-full sm:w-1/2 ">
								<div className="flex gap-4">
									<span className="font-semibold text-xl">Meta diária</span>
									<span className="font-medium text-xl text-primary">
										<Tooltip title="Tempo decorrido">
											<span>
												{formattedTime(
													dataProgress?.[0].totalSessionFocusDuration ?? 0,
												)}{" "}
											</span>
										</Tooltip>
										/
										<Tooltip title="Tempo de sua meta">
											<span>{formattedTime(timeTotalTarget)}</span>
										</Tooltip>
									</span>
								</div>
								<Progressbar
									percentage={
										((dataProgress?.[0].totalSessionFocusDuration ?? 0) /
											timeTotalTarget) *
										100
									}
								/>

								<span className="font-medium text-gray-500">
									Falta pouco para completar sua meta, não desista!
								</span>
								<Button size="large" onClick={() => navigate("/pomodoro")}>
									<FaPlay className="text-white" />
									<span className="font-semibold text-base">
										Começar Concentração
									</span>
								</Button>
							</div>

							<div className="flex self-start gap-6">
								<div className=" bg-primary-bg px-3.5 py-5.5 rounded-full">
									<FaFireAlt className="text-primary text-4xl" />
								</div>
								<div className="flex flex-col">
									<span className="font-semibold text-xl">
										Dias consecutivos
									</span>
									<span className="font-bold text-4xl text-primary">
										{(user?.longestStreak ?? 0) <= 1
											? `${user?.longestStreak ?? 0} dia`
											: `${user?.longestStreak} dias`}
									</span>
								</div>
							</div>
						</Container>

						<Container className="flex flex-col gap-4 relative">
							<TaskContainer />
						</Container>

						<Container className="flex-col md:flex-row justify-between gap-8">
							<MenuData
								title="Tempo total"
								textMain="12h 45min"
								description="Está semana"
							>
								<FaClock className="text-primary text-4xl" />
							</MenuData>
							<MenuData
								title="Tarefas concluídas"
								textMain="24"
								description="Está semana"
							>
								<FaCheck className="text-primary text-4xl" />
							</MenuData>
							<MenuData
								title="Melhor dia"
								textMain="Segunda"
								description="4h 30min"
							>
								<FaTrophy className="text-primary text-4xl" />
							</MenuData>
						</Container>
					</div>
				</main>
			)}
		</>
	);
};

export default DashboardPage;
