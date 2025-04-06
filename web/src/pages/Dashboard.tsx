import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/auth.context";

const DashboardPage = () => {
	const { user, lougout } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!user) {
			navigate("/");
		}
		console.log("User:", user);
	}, [user, navigate]);

	return (
		<div className="min-h-screen bg-gray-100">
			<header className="bg-blue-600 text-white py-4 shadow-md">
				<div className="container mx-auto px-4">
					<h1 className="text-2xl font-bold">Dashboard</h1>
				</div>
			</header>
			<main className="container mx-auto px-4 py-6">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<div className="bg-white p-6 rounded-lg shadow-md">
						<h2 className="text-lg font-semibold mb-2">Card 1</h2>
						<p className="text-gray-600">This is some content for card 1.</p>
					</div>
					<div className="bg-white p-6 rounded-lg shadow-md">
						<h2 className="text-lg font-semibold mb-2">Card 2</h2>
						<p className="text-gray-600">This is some content for card 2.</p>
					</div>
					<div className="bg-white p-6 rounded-lg shadow-md">
						<h2 className="text-lg font-semibold mb-2">Card 3</h2>
						<p className="text-gray-600">This is some content for card 3.</p>
					</div>
				</div>
				<button
					type="button"
					className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
					onClick={() => lougout()}
				>
					Sair
				</button>
			</main>
		</div>
	);
};

export default DashboardPage;
