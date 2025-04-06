import { useEffect } from "react";
import { useNavigate } from "react-router";
import Header from "../components/Header";
import { useAuth } from "../context/auth.context";

const DashboardPage = () => {
	const { user, lougout } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!user) {
			navigate("/login");
		}
		console.log("User:", user);
	}, [user, navigate]);

	return (
		<div className="bg-background">
			<Header />
		</div>
	);
};

export default DashboardPage;
