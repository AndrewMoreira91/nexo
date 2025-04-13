import Button from "../components/Button";

const Error404Page = () => {
	return (
		<div className="flex flex-col gap-2 items-center justify-center h-screen bg-background">
			<h1 className="text-9xl font-bold text-gray-800">404</h1>
			<p className="text-2xl font-semibold text-gray-600 mt-4">
				Oops! Página não encontrada.
			</p>
			<p className="text-gray-500 mt-2">
				A página que você está procurando não existe ou foi removida.
			</p>
			<a href="/">
				<Button size="large">Voltar para o início</Button>
			</a>
		</div>
	);
};

export default Error404Page;
