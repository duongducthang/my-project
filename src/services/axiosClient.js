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

// ================= REQUEST INTERCEPTOR =================

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

// ================= RESPONSE INTERCEPTOR =================

axiosClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(
        `[API Response] ${response.config.url}`,
        response.data
      );
    }

    return response;
  },
  (error) => {
    const status = error.response?.status;

    // Token expired
    if (status === HTTP_STATUS.UNAUTHORIZED) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);

      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    // Server error
    if (status === HTTP_STATUS.SERVER_ERROR) {
      console.error("Server error");
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    return Promise.reject({
      message,
      status,
    });
  }
);

export default axiosClient;
