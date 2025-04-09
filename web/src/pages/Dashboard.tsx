import { useEffect } from "react";
import { FaCheck, FaClock, FaFireAlt, FaPlay, FaTrophy } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router";
import Button from "../components/Button";
import Container from "../components/Conteiner";
import Footer from "../components/Footer";
import Header from "../components/Header";
import MenuData from "../components/MenuData";
import Progressbar from "../components/Progressbar";
import TaskItem from "../components/TaskItem";
import { useAuth } from "../context/auth.context";

const DashboardPage = () => {
	const { user } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!user) {
			navigate("/login");
		}
	}, [user, navigate]);

	return (
		<div className="bg-background">
			<Header />

			<main className="px-16 my-12">
				<div>
					<h3 className="font-bold text-3xl">Bem vindo, Andrew!</h3>
					<span className="font-medium text-xl text-gray-500">Vamos começar mais um dia produtivo?</span>
				</div>

				<div className="flex flex-col gap-8 my-12">
					<Container className="justify-between">
						<div className="flex flex-col gap-4 w-1/2 ">
							<div className="flex gap-4">
								<span className="font-semibold text-xl">Meta diária</span>
								<span className="font-medium text-xl text-primary">2h 30min / 4h</span>
							</div>
							<Progressbar percentage={68} />

							<span className="font-medium text-gray-500">Falta pouco para completar sua meta, não desista!</span>
							<Button size="large" onClick={() => navigate('/pomodoro')}>
								<FaPlay className="text-white" />
								<span className="font-semibold text-base">Começar Concentração</span>
							</Button>
						</div>

						<div className="flex self-start gap-6">
							<div className=" bg-primary-bg px-3.5 py-5.5 rounded-full">
								<FaFireAlt className="text-primary text-4xl" />
							</div>
							<div className="flex flex-col">
								<span className="font-semibold text-xl">Dias consecutivos</span>
								<span className="font-bold text-4xl text-primary">7 dias</span>
							</div>
						</div>
					</Container>

					<Container className="flex flex-col gap-4">
						<div className="flex flex-row justify-between w-full">
							<h5 className="font-bold text-xl">Tarefas</h5>
							<Button>
								<FaPlus className="text-white" />
								Nova Tarefa
							</Button>
						</div>

						<div className="flex flex-col gap-4">
							<TaskItem title="Task title" isCompleted={true} />
							<TaskItem title="Task title" isCompleted={false} tagType="pending" />
							<TaskItem title="Task title" isCompleted={false} tagType="pending" />
							<TaskItem title="Task title" isCompleted={false} tagType="pending" />
						</div>
					</Container>

					<Container className="justify-between gap-8">
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

			<Footer />
		</div>
	);
};

export default DashboardPage;
