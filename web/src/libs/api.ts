import axios from "axios";
("");
export const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

export const setAuthToken = (token: string | null) => {
	if (token) {
		api.defaults.headers.common.Authorization = `Bearer ${token}`;
	} else {
		api.defaults.headers.common.Authorization = undefined;
	}
};

const TIME_OUT = 10000; // 10 seconds

api.interceptors.request.use((config) => {
	const timer = setTimeout(() => {
		console.warn(`API request to ${config.url} timed out after ${TIME_OUT}ms`);
		window.dispatchEvent(new CustomEvent("apiSlow", { detail: { url: config.url } }));
	}, TIME_OUT);
	(config as any).metadata = { timer };
	return config;
});

api.interceptors.response.use(
	(response) => {
		const metadata = (response.config as any).metadata;
		if (metadata?.timer) clearTimeout(metadata.timer);
		return response;
	},
	(error) => {
		if (error.response.data.error === "TokenExpiredError") {
			localStorage.removeItem("accessToken");
			localStorage.removeItem("user");
			window.location.href = "/login";
		}
		return Promise.reject(error);
	},
);
