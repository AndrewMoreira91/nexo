import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Button from "../../components/Button";
import { useAuth } from "../../context/auth.context";

import { Input } from "@mui/joy";
import imgSaly from "../../assets/saly.png";

const RegisterPage = () => {
	const navigate = useNavigate();
	const { register, isAuthenticated } = useAuth();

	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		if (name === "confirmPassword") {
		}

		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const { username, email, password } = formData;
		register({ name: username, email, password });
		navigate("/dashboard");
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
						<h2 className="text-3xl font-semibold">Cire sua conta</h2>
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
					<form onSubmit={handleSubmit} className="mt-6 max-w-lg">
						<div className="flex flex-col gap-4">
							<div>
								<label
									htmlFor="name"
									className="block text-sm font-medium text-gray-700"
								>
									Nome
								</label>
								<Input
									type="text"
									id="username"
									name="username"
									value={formData.username}
									onChange={handleChange}
									required
									placeholder="Digite seu nome"
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
									type="email"
									id="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									required
									placeholder="Digite seu email"
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
									name="password"
									value={formData.password}
									onChange={handleChange}
									required
									placeholder="Digite sua senha"
								/>
							</div>

							<div>
								<label
									htmlFor="confirm-password"
									className="block text-sm font-medium text-gray-700"
								>
									Confirme a senha
								</label>
								<Input
									type="password"
									id="confirm-password"
									name="confirmPassword"
									value={formData.confirmPassword}
									onChange={handleChange}
									required
									placeholder="Confirme sua senha"
								/>
								{formData.password !== formData.confirmPassword &&
									formData.confirmPassword.length > 0 && (
										<div className="text-sm text-red-500 mt-1">
											As senhas não coincidem
										</div>
									)}
							</div>
							<Button type="submit" size="small">
								Criar conta
							</Button>
						</div>
					</form>
				</section>

				<section className="hidden flex-1 sm:flex flex-col gap-6 items-center justify-center p-8 mr-6 my-6 bg-[#000842] rounded-2xl">
					<div className="w-full">
						<h3 className="text-white text-start text-4xl font-bold w-full">
							Cria sua conta no Nexo
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
