import { useEffect } from 'react'
import { FaCheck, FaClock, FaFireAlt, FaPlay, FaTrophy } from 'react-icons/fa'
import { useNavigate } from 'react-router'
import Button from '../components/Button'
import Container from '../components/Conteiner'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Loader from '../components/Loader'
import MenuData from '../components/MenuData'
import Progressbar from '../components/Progressbar'
import TaskContainer from '../components/TaskContainer'
import { useAuth } from '../context/auth.context'
import type { TaskType } from '../types'

const taskListFake = [
	{
		id: '1',
		title: 'Estudar React',
		description: 'Assistir aulas e praticar com projetos',
		isCompleted: false,
	},
	{
		id: '2',
		title: 'Fazer exercícios',
		description: 'Treino de 30 minutos',
		isCompleted: false,
	},
	{
		id: '3',
		title: 'Ler um livro',
		description: 'Ler 20 páginas de um livro de desenvolvimento pessoal',
		isCompleted: false,
	},
	{
		id: '4',
		title: 'Planejar a semana',
		description: 'Organizar tarefas e compromissos no planner',
		isCompleted: false,
	},
] as TaskType[]

const DashboardPage = () => {
	const { user, isLoading } = useAuth()
	const navigate = useNavigate()

	useEffect(() => {
		if (!user) {
			navigate('/login')
		}
	}, [user, navigate])

	console.log('user', user)

	return (
		<div className="bg-background">
			<Header />
			{isLoading && user === null ? (
				<Loader />
			) : (
				<main className="px-6 sm:px-16 my-12">
					<div>
						<h3 className="font-bold text-2xl sm:text-3xl">Bem vindo, Andrew!</h3>
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
										2h 30min / 4h
									</span>
								</div>
								<Progressbar percentage={68} />

								<span className="font-medium text-gray-500">
									Falta pouco para completar sua meta, não desista!
								</span>
								<Button size="large" onClick={() => navigate('/pomodoro')}>
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
									<span className="font-semibold text-xl">Dias consecutivos</span>
									<span className="font-bold text-4xl text-primary">7 dias</span>
								</div>
							</div>
						</Container>

						<Container className="flex flex-col gap-4">
							<TaskContainer taskList={taskListFake} />
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
			<Footer />
		</div>
	)
}

export default DashboardPage
