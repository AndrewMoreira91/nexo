import { FaFireAlt, FaTasks } from 'react-icons/fa'
import { FiTarget } from 'react-icons/fi'
import { GoGraph } from 'react-icons/go'
import { Navigate, useNavigate } from 'react-router'
import img from '../assets/medium-shot-woman-working-laptop 1.png'
import Button from '../components/Button'
import MenuInfo from '../components/MenuInfo'
import { useAuth } from '../context/auth.context'

const WelcomePage = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/pomodoro" replace />
  }

  return (
    <>
      <main className="bg-background">
        <section className="flex flex-col md:flex-row items-center px-7 sm:px-16 mt-10 gap-4">
          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-4xl md:text-5xl">
              Maximize seu foco,
            </h2>
            <h2 className="font-bold text-4xl md:text-5xl text-primary">
              alcance seus objetivos
            </h2>
            <p className="font-medium text-gray-500 text-sm md:text-xl/6">
              Use o método <strong className="text-primary">Pomodoro</strong>{' '}
              para transformar seu tempo em produtividade. Estabeleça metas,
              mantenha o foco e acompanhe o progresso.
            </p>
            <div className="flex gap-4">
              <Button
                type="button"
                size="large"
                theme="primary"
                onClick={() => navigate('/login')}
              >
                <span>Começar agora</span>
              </Button>
            </div>
          </div>

          <img
            src={img}
            className="w-full md:w-sm lg:w-auto"
            alt="Mulher trabalhando no laptop"
          />
        </section>

        <section className="flex flex-col gap-6 bg-white px-7 sm:px-16 py-16 items-center">
          <div className="flex flex-col items-center gap-2">
            <h3 className="font-semibold text-2xl sm:text-4xl">
              Recursos principais
            </h3>
            <span className="font-medium text-gray-400 text-[14px] sm:text-base">
              Tudo o que você precisa para maximizar a sua produtividade
            </span>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <MenuInfo
              title="Defina metas"
              description="Defina metas diárias e semanais para acompanhar seu progresso e se manter motivado."
            >
              <FiTarget size={28} className="text-primary" />
            </MenuInfo>
            <MenuInfo
              title="Contador de Streak"
              description="Mantenha sua motivação com sequências de dias concluídos"
            >
              <FaFireAlt size={28} className="text-primary" />
            </MenuInfo>
            <MenuInfo
              title="Gestão de tarefas"
              description="Organize e acompanhe suas tarefas por sessão"
            >
              <FaTasks size={28} className="text-primary" />
            </MenuInfo>
            <MenuInfo
              title="Dashboard"
              description="Visualize relatórios e estatísticas detalhadas"
            >
              <GoGraph size={28} className="text-primary" />
            </MenuInfo>
          </div>
        </section>

        <section className="flex flex-col items-center gap-2 sm:gap-8 bg-primary-bg px-7 py-16">
          <h3 className="font-bold text-3xl sm:text-4xl">
            Pronto para aumentar sua produtividade?
          </h3>
          <span className="tex-xl sm:text-2xl font-medium text-gray-500">
            Comece agora mesmo e transforme sua forma de estudar
          </span>
          <Button
            type="button"
            theme="primary"
            size="large"
            onClick={() => navigate('/login')}
          >
            Começar Gratuitamente
          </Button>
        </section>
      </main>
    </>
  )
}

export default WelcomePage
