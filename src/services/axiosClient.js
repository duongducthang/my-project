import axios from 'axios';
import { API_ENDPOINT_URL, DEFAULT_TIMEOUT, STORAGE_KEYS, HTTP_STATUS, ROUTE_LOGIN_PATH, IS_PRODUCTION } from '../constants';

const axiosClient = axios.create({
  baseURL: API_ENDPOINT_URL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (!IS_PRODUCTION) {
      console.log(`[Request] ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params,
      });
    }

    return config;
  },
  (error) => {
    if (!IS_PRODUCTION) {
      console.error('[Request Error]', error);
    }
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    if (!IS_PRODUCTION) {
      console.log(`[Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }

    return response.data;
  },
  (error) => {
    const { response } = error;

    if (!IS_PRODUCTION) {
      console.error('[Response Error]', {
        url: error.config?.url,
        method: error.config?.method,
        status: response?.status,
        data: response?.data,
        message: error.message,
      });
    }

    if (response?.status === HTTP_STATUS.UNAUTHORIZED) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      
      if (window.location.pathname !== ROUTE_LOGIN_PATH) {
        window.location.href = ROUTE_LOGIN_PATH;
      }
    }

    if (response?.status === HTTP_STATUS.FORBIDDEN) {
      console.warn('Access forbidden');
    }

    if (response?.status === HTTP_STATUS.SERVER_ERROR) {
      console.error('Server error occurred');
    }

    const errorMessage = response?.data?.message || error.message || 'An error occurred';
    return Promise.reject({
      ...error,
      message: errorMessage,
      status: response?.status,
    });
  }
);

export default axiosClient;
