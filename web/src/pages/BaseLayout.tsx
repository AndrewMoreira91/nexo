const BaseLayout = () => {
	return (
		<div className="flex flex-col h-screen">
			<header className="bg-gray-800 text-white p-4">
				<h1 className="text-xl">My Application</h1>
			</header>
			<main className="flex-grow p-4">
				{/* This is where the child routes will be rendered */}
			</main>
			<footer className="bg-gray-800 text-white p-4">
				<p>&copy; 2023 My Application</p>
			</footer>
		</div>
	);
};

export default BaseLayout;
