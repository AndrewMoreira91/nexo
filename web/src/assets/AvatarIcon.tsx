type AvatarIconProps = {
	color?: string;
};

const AvatarIcon = ({ color }: AvatarIconProps) => {
	return (
		// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
		<svg
			width="55"
			height="55"
			viewBox="0 0 55 55"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle
				cx="27.5"
				cy="27.5"
				r="26.5"
				stroke={`${color ? color : "#272727"}`}
				strokeWidth="2"
			/>
			<path
				d="M27.5 31.4285C31.8393 31.4285 35.3571 27.9108 35.3571 23.5714C35.3571 19.232 31.8393 15.7142 27.5 15.7142C23.1606 15.7142 19.6428 19.232 19.6428 23.5714C19.6428 27.9108 23.1606 31.4285 27.5 31.4285Z"
				stroke={`${color ? color : "#272727"}`}
				strokeWidth="2"
				strokeMiterlimit="10"
			/>
			<path
				d="M15.5915 38.3035C16.7982 36.2129 18.534 34.4769 20.6244 33.2698C22.7148 32.0628 25.0861 31.4274 27.5 31.4274C29.9138 31.4274 32.2851 32.0628 34.3755 33.2698C36.4659 34.4769 38.2017 36.2129 39.4085 38.3035"
				stroke={`${color ? color : "#272727"}`}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export default AvatarIcon;
