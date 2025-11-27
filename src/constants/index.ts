// TODO: Define constants

const getEnvBool = (v: unknown) => String(v ?? '').toLowerCase() === 'true';

export const ENV = {
  MODE: import.meta.env.MODE,
  VITE_API_URL: import.meta.env.VITE_API_URL as string | undefined,
  VITE_ENABLE_MOCKS: getEnvBool(import.meta.env.VITE_ENABLE_MOCKS),
} as const;

export const IS_PRODUCTION = ENV.MODE === 'production';
export const DEFAULT_TIMEOUT = 10_000;
export const API_ENDPOINT_URL: string = ENV.VITE_API_URL ?? '/api';

export const API_ENDPOINTS = {
  AUTH: '/auth',
  // TODO: Add your API endpoints here
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  // TODO: Add your routes here
} as const;

export const ROUTE_LOGIN_PATH: string = ROUTES.LOGIN;

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  // TODO: Add your storage keys here
} as const;

export const HTTP_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  // TODO: Add more HTTP status codes as needed
} as const;
