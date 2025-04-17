import { Outlet } from "react-router";
import Footer from "../components/Footer";
import Header from "../components/Header";

const BaseLayout = () => {
	return (
		<div className="bg-background">
			<Header />
			<Outlet />
			<Footer />
		</div>
	);
};

export default BaseLayout;
