import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Button from "../../components/Button";
import { useAuth } from "../../context/auth.context";

import { Input } from "@mui/joy";
import imgSaly from "../../assets/saly.png";
import TextError from "../../components/TextError";

import { type SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  const {
    register: formRegister,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit: SubmitHandler<Inputs> = async () => {
    setIsLoading(true);
    const { isError, error: registerError } = await register({
      name: formData.username,
      email: formData.email,
      password: formData.password,
    });

    if (isError) {
      if (registerError && registerError.statusCode === 409)
        setFormErrors((prev) => ({
          ...prev,
          email: registerError.message,
        }));
      setIsLoading(false);
      return;
    }

    navigate("/steps");
    setIsLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <div className="flex flex-row">
        <section className="flex-1 m-8 sm:mt-6 md:ml-24">
          <div>
            <h2 className="text-3xl font-semibold">Crie sua conta</h2>
            <div className="flex flex-col mt-8">
              <span>Se você já tem uma conta registrada</span>
              <span>
                Faça o{" "}
                <button
                  type="button"
                  className="font-semibold text-primary cursor-pointer"
                  onClick={() => navigate("/login")}
                >
                  login aqui
                </button>
              </span>
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 max-w-lg">
            <div className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nome
                </label>
                <Input
                  {...formRegister("username", {
                    required: "Campo obrigatório",
                    minLength: {
                      value: 3,
                      message: "O nome deve ter pelo menos 3 caracteres",
                    },
                    maxLength: {
                      value: 20,
                      message: "O nome deve ter no máximo 20 caracteres",
                    },
                  })}
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="Digite seu nome"
                  autoComplete="username"
                  autoFocus
                  color={
                    errors.username || formErrors.username
                      ? "danger"
                      : "neutral"
                  }
                />
                <TextError
                  text={errors.username?.message || formErrors.username}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <Input
                  {...formRegister("email", {
                    required: "Campo obrigatório",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Email inválido",
                    },
                  })}
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Digite seu email"
                  autoComplete="email"
                  color={
                    errors.email || formErrors.email ? "danger" : "neutral"
                  }
                />
                <TextError text={errors.email?.message || formErrors.email} />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Senha
                </label>
                <Input
                  {...formRegister("password", {
                    required: "Campo obrigatório",
                    minLength: {
                      value: 6,
                      message: "A senha deve ter pelo menos 6 caracteres",
                    },
                  })}
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Digite sua senha"
                  autoComplete="billing new-password"
                  color={
                    errors.password || formErrors.password
                      ? "danger"
                      : "neutral"
                  }
                />
                <TextError
                  text={errors.password?.message || formErrors.password}
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirme a senha
                </label>
                <Input
                  {...formRegister("confirmPassword", {
                    required: "Campo obrigatório",
                    minLength: {
                      value: 6,
                      message: "A senha deve ter pelo menos 6 caracteres",
                    },
                    validate: (value) =>
                      value === watch("password") || "As senhas não coincidem",
                  })}
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirme sua senha"
                  autoComplete="new-password"
                  color={
                    errors.confirmPassword || formErrors.confirmPassword
                      ? "danger"
                      : "neutral"
                  }
                />
                <TextError
                  text={
                    errors.confirmPassword?.message ||
                    formErrors.confirmPassword
                  }
                />
              </div>
              <Button type="submit" size="small" isLoading={isLoading}>
                Criar conta
              </Button>
            </div>
          </form>
        </section>

        <section className="hidden flex-1 sm:flex flex-col gap-6 items-center justify-center p-8 mr-6 my-6 bg-[#000842] rounded-2xl">
          <div className="w-full">
            <h3 className="text-white text-start text-4xl font-bold w-full">
              Crie sua conta no Nexo
            </h3>
            <span className="text-white text-start w-full">
              E saiba o que é ter hábito de estudar
            </span>
          </div>
          <img src={imgSaly} alt="Saly" />
        </section>
      </div>
    </>
  );
};

export default RegisterPage;
