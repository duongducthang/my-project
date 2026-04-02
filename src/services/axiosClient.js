import axios from "axios";

// ENV (Vite standard)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Storage keys
const TOKEN_KEY = "access_token";
const USER_KEY = "user";

// HTTP status
const HTTP_STATUS = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  SERVER_ERROR: 500,
};

// Axios instance
const axiosClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});


axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (import.meta.env.DEV) {
      console.log(
        `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
        config.data || config.params
      );
    }

    return config;
  },
  (error) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  }
);


axiosClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.url}`, response.data);
    }
    return response.data;
  },
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;

    if (status === HTTP_STATUS.UNAUTHORIZED) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem("currentUser");

      if (
        !window.location.pathname.includes("/login") &&
        !window.location.pathname.includes("/register")
      ) {
        window.location.href = "/login";
      }
    }

    const message = data?.message || error.message || "Đã có lỗi xảy ra";
    console.error(`[API Error] ${status}: ${message}`, data);

    return Promise.reject({ message, status, data });
  }
);

export default axiosClient;
