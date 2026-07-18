import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/",
});

// 1. Request Interceptor: Attach token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            // Optional: Uncomment the line below to verify the token is being sent in the console
            // console.log("Token attached:", token.substring(0, 20) + "..."); 
        } else {
            console.warn("⚠️ No access token found in localStorage!");
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 2. Response Interceptor: Handle 401 errors globally
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error("🚫 Unauthorized: Token expired or invalid. Logging out...");
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            localStorage.removeItem("user");
            window.location.href = "/"; // Force redirect to login page
        }
        return Promise.reject(error);
    }
);

export default api;