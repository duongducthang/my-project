// TODO: Implement HTTP utilities
import axiosClient from './axiosClient';
import type { AxiosRequestConfig } from 'axios';

const http = {
  get: (url: string, config?: AxiosRequestConfig) => axiosClient.get(url, config),
  post: (url: string, data?: unknown, config?: AxiosRequestConfig) => axiosClient.post(url, data, config),
  put: (url: string, data?: unknown, config?: AxiosRequestConfig) => axiosClient.put(url, data, config),
  patch: (url: string, data?: unknown, config?: AxiosRequestConfig) => axiosClient.patch(url, data, config),
  delete: (url: string, config?: AxiosRequestConfig) => axiosClient.delete(url, config),
};

export default http;
