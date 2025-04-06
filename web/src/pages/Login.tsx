import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/auth.context";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const { login, isAuthenticated, user } = useAuth();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Email:", email);
		console.log("Password:", password);

		login({ email, password });
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

		</div>
	);
};

export default LoginPage;
