import { Input } from '@mui/joy'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import imgSaly from '../assets/saly.png'
import Button from '../components/Button'
import { useAuth } from '../context/auth.context'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const { login, isAuthenticated } = useAuth()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login({ email, password })
    navigate('/dashboard')
  }

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  return (
    <>
      <div className="flex flex-row">
        <section className="flex-1 m-8 sm:mt-6 md:ml-24">
          <div>
            <h2 className="text-3xl font-semibold">Entre na sua conta</h2>
            <div className="flex flex-col mt-8">
              <span>Se você ainda não tem uma conta</span>
              <span>
                Faça o{' '}
                <button
                  type="button"
                  className="font-semibold text-primary cursor-pointer"
                  onClick={() => navigate('/register')}
                >
                  registro aqui
                </button>
              </span>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="mt-6 max-w-lg">
            <div className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Digite o seu email"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Senha
                </label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Digite a sua senha"
                  required
                />
              </div>
              <Button type="submit" size="small">
                Entrar
              </Button>
            </div>
          </form>
        </section>

        <section className="hidden flex-1 sm:flex flex-col gap-6 items-center justify-center p-8 mr-6 my-6 bg-[#000842] rounded-2xl">
          <div className="w-full">
            <h3 className="text-white text-start text-4xl font-bold w-full">
              Entre no Nexo
            </h3>
            <span className="text-white text-start w-full">
              E comece a ter o hábito de estudar
            </span>
          </div>
          <img src={imgSaly} alt="Saly" />
        </section>
      </div>
    </>
  )
}

export default LoginPage
