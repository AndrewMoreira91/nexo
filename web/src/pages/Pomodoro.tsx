import { useEffect, useState } from 'react'
import { FaClock, FaFireAlt, FaPause, FaPlay, FaPlus } from 'react-icons/fa'
import { FiTarget } from 'react-icons/fi'
import { GrPowerReset } from 'react-icons/gr'
import Button from '../components/Button'
import ButtonGroup from '../components/ButtonGroup'
import Container from '../components/Conteiner'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Loader from '../components/Loader'
import MenuData from '../components/MenuData'
import TaskItem from '../components/TaskItem'
import { useAuth } from '../context/auth.context'
import { startTimer, stopTimer } from '../utils/timer'

type ModesType = 'pomodoro' | 'pausa curta' | 'pausa longa'

const PomodoroPage = () => {
	const { user, isLoading } = useAuth()
	const [selectedMode, setSelectedMode] = useState<ModesType>('pomodoro')
	const [timeLeft, setTimeLeft] = useState<number>(0)
	const [isTimerRunning, setIsTimerRunning] = useState(false)

	function toggleTimer() {
		if (isTimerRunning) {
			stopTimer()
			setIsTimerRunning(false)
			return
		}

		setIsTimerRunning(true)

		startTimer(
			() => {
				setTimeLeft((prevTimeLeft) => {
					if (prevTimeLeft <= 0) {
						setIsTimerRunning(false)
						return 0
					}
					return prevTimeLeft - 1
				})
			}
		)
	}

	function handleClickReset() {
		if (!isTimerRunning) {
			stopTimer()
			setIsTimerRunning(false)
		}

		if (!user) return null
		if (selectedMode === 'pomodoro') {
			setTimeLeft(user.focusSessionDuration)
		} else if (selectedMode === 'pausa curta') {
			setTimeLeft(user.shortBreakSessionDuration)
		} else if (selectedMode === 'pausa longa') {
			setTimeLeft(user.longBreakSessionDuration)
		}
		setIsTimerRunning(false)
	}

	useEffect(() => {
		if (!user) return undefined
		if (selectedMode === 'pomodoro') {
			setTimeLeft(user.focusSessionDuration)
			// setTimeLeft(10)
		} else if (selectedMode === 'pausa curta') {
			setTimeLeft(user.shortBreakSessionDuration)
		} else if (selectedMode === 'pausa longa') {
			setTimeLeft(user.longBreakSessionDuration)
		}
	}, [selectedMode, user])

	return (
		<div>
			<Header />
			{isLoading ? <Loader />
				: <main className="flex flex-col px-16 gap-12">
					<section className="w-full flex flex-col gap-5 items-center bg-primary-bg py-6 rounded-lg">
						{isLoading && <p>Loading...</p>}
						<h3 className="font-bold text-3xl">Sessão de foco</h3>
						<span className="font-medium text-xl text-gray-500">Matenha o foco, você está progredindo a cada minuto</span>

						<span className="font-bold text-8xl text-primary">
							{`${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? '0' : ''}${timeLeft % 60}`}
						</span>

						<div className="flex flex-row gap-4">
							<Button
								className="rounded-lg"
								type="button"
								size="large"
								onClick={() => toggleTimer()}>
								{isTimerRunning ?
									<FaPause className="text-xl" /> :
									<FaPlay className="text-xl" />
								}
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
							values={["pomodoro", "pausa curta", "pausa longa"]}
							setSelectedValue={(value: string) => {
								setSelectedMode(value as ModesType)
							}}
						/>

					</section>

					<Container className="justify-between gap-8">
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
						<div className="flex flex-row justify-between w-full">
							<h5 className="font-bold text-xl">Tarefas</h5>
							<Button>
								<FaPlus className="text-white" />
								Nova Tarefa
							</Button>
						</div>

						<div className="flex flex-col gap-4">
							<TaskItem title="Task title" isCompleted={true} />
							<TaskItem title="Task title" isCompleted={false} tagType="in-progress" />
							<TaskItem title="Task title" isCompleted={false} tagType="pending" />
							<TaskItem title="Task title" isCompleted={false} tagType="pending" />
						</div>
					</Container>
				</main>
			}
			<Footer />
		</div >
	)
}

export default PomodoroPage
