type ProgressbarProps = {
	percentage: number;
};

const Progressbar: React.FC<ProgressbarProps> = ({ percentage }) => {
	return (
		<div className="w-full h-5 bg-gray-200 rounded-full">
			<div className="h-full bg-blue-500 rounded-full" style={{ width: `${percentage}%` }} />
		</div>
	);
}

export default Progressbar;