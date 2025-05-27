import axios from "axios";
("");
export const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 11000, // 11 seconds timeout
});

export const setAuthToken = (token: string | null) => {
	if (token) {
		api.defaults.headers.common.Authorization = `Bearer ${token}`;
	} else {
		api.defaults.headers.common.Authorization = undefined;
	}
};

api.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		if (error.code === "ECONNABORTED" && error.message.includes("timeout")) {
			console.error("API request timed out:", error);
			window.dispatchEvent(new CustomEvent("apiTimeout", { detail: error }));
		}
		if (error.response.data.error === "TokenExpiredError") {
			localStorage.removeItem("accessToken");
			localStorage.removeItem("user");
			window.location.href = "/login";
		}
		return Promise.reject(error);
	},
);
