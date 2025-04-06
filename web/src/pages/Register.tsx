import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/auth.context";

const RegisterPage = () => {
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const navigate = useNavigate();

	const { register, isAuthenticated, user } = useAuth();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Email:", formData.email);
		console.log("Password:", formData.password);

		const { username, email, password } = formData;
		register({ name: username, email, password });
		navigate("/dashboard");
	};

	useEffect(() => {
		console.log("User:", user);

		if (isAuthenticated) {
			navigate("/dashboard");
		}
	}, [isAuthenticated, navigate, user]);

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="w-full max-w-md p-8 bg-white rounded shadow-md">
				<h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
					Register
				</h2>
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label
							htmlFor="username"
							className="block mb-2 text-sm font-medium text-gray-600"
						>
							Username
						</label>
						<input
							type="text"
							id="username"
							name="username"
							value={formData.username}
							onChange={handleChange}
							className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
							placeholder="Enter your username"
							required
						/>
					</div>
					<div className="mb-4">
						<label
							htmlFor="email"
							className="block mb-2 text-sm font-medium text-gray-600"
						>
							Email
						</label>
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
							placeholder="Enter your email"
							required
						/>
					</div>
					<div className="mb-6">
						<label
							htmlFor="password"
							className="block mb-2 text-sm font-medium text-gray-600"
						>
							Password
						</label>
						<input
							type="password"
							id="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
							placeholder="Enter your password"
							required
						/>
					</div>
					<button
						type="submit"
						className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
					>
						Register
					</button>
					<p>
						Já tem uma conta?{" "}
						<a href="/login" className="text-blue-500 hover:underline">
							Login
						</a>
					</p>
				</form>
			</div>
		</div>
	);
};

export default RegisterPage;
