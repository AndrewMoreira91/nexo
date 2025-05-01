const TextError = ({ text }: { text?: string }) => {
	return <span className="text-sm font-medium text-red-500 mt-1">{text}</span>;
};

export default TextError;
