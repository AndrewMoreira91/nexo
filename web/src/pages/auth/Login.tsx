import { Input } from "@mui/joy";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import imgSaly from "../../assets/saly.png";
import Button from "../../components/Button";
import TextError from "../../components/TextError";
import { useAuth } from "../../context/auth.context";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [formsErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const errors = { email: "", password: "" };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) errors.email = "Email é obrigatório";
    else if (!emailRegex.test(email)) errors.email = "Email inválido";

    if (!password) errors.password = "Senha é obrigatória";
    else if (password.length < 6)
      errors.password = "Senha deve ter pelo menos 6 caracteres";

    setFormErrors(errors);
    return !errors.email && !errors.password;
  };

  const handleLogin = async () => {
    const { isError, error: loginError } = await login({ email, password });
    if (isError) {
      const errorMessage = loginError?.message || "Erro ao fazer login";
      setFormErrors({ email: errorMessage, password: errorMessage });
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    const isLoginSuccessful = await handleLogin();
    if (isLoginSuccessful) navigate("/dashboard");
    setIsLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated]);

  return (
    <>
      <div className="flex flex-row">
        <section className="flex-1 m-8 sm:mt-6 md:ml-24">
          <div>
            <h2 className="text-3xl font-semibold">Entre na sua conta</h2>
            <div className="flex flex-col mt-8">
              <span>Se você ainda não tem uma conta</span>
              <span>
                Faça o{" "}
                <button
                  type="button"
                  className="font-semibold text-primary cursor-pointer"
                  onClick={() => navigate("/register")}
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
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite o seu email"
                  variant="outlined"
                  color={formsErrors.email ? "danger" : "neutral"}
                  required
                />
                {formsErrors.email && <TextError text={formsErrors.email} />}
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
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite a sua senha"
                  color={formsErrors.password ? "danger" : "neutral"}
                  required
                />
                {formsErrors.password && (
                  <TextError text={formsErrors.password} />
                )}
              </div>
              <Button type="submit" size="small" isLoading={isLoading}>
                Entrar
              </Button>
            </div>
          </form>
        </section>

        <section className="hidden flex-1 sm:flex flex-col gap-6 items-center justify-center p-8 mr-6 my-6 bg-[#000842] rounded-2xl">
          <div className="w-full">
            <h3 className="text-white text-start text-4xl font-bold w-full">
              Entre no Nekso
            </h3>
            <span className="text-white text-start w-full">
              E comece a ter o hábito de estudar
            </span>
          </div>
          <img src={imgSaly} alt="Saly" />
        </section>
      </div>
    </>
  );
};

export default LoginPage;
