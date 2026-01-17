# 📁 Project Structure - React Base App

## 🌳 Directory Structure

```
react-base-app/
└── frontend/
    ├── 📄 Configuration Files
    │   ├── package.json              # Manage dependencies and scripts
    │   ├── package-lock.json         # Lock file for dependencies
    │   ├── vite.config.js            # Vite configuration (build tool)
    │   ├── tsconfig.json             # TypeScript configuration
    │   ├── eslint.config.js          # ESLint configuration (code linting)
    │   ├── index.html                # Entry HTML file
    │   └── .gitignore                # Git ignore rules
    │
    ├── 📁 public/                    # Static assets (not processed by build)
    │   └── vite.svg                  # Vite logo
    │
    └── 📁 src/                       # Main source code
        ├── 📄 Entry Points
        │   ├── main.jsx              # React application entry point
        │   └── App.jsx               # Root component, defines routing
        │
        ├── 📁 assets/                # Static assets (images, icons, fonts)
        │   ├── logo.png
        │   └── react.svg
        │
        ├── 📁 components/            # Reusable UI components
        │   ├── 📁 common/            # Common/shared components
        │   │   ├── LoadingSpinner.jsx    # Component to display loading indicator
        │   │   └── ScrollToTop.jsx        # Component to automatically scroll to top of page
        │   └── ErrorToast.jsx        # Component to display error messages
        │
        ├── 📁 constants/             # Constants and configuration values
        │   └── index.ts              # Define all constants (API endpoints, routes, storage keys, etc.)
        │
        ├── 📁 contexts/              # React Context API
        │   └── AuthContext.jsx       # Context to manage authentication state (not implemented yet)
        │
        ├── 📁 hooks/                 # Custom React hooks
        │   ├── 📁 auth/
        │   │   └── useAuth.jsx       # Hook to use AuthContext
        │   └── index.ts              # Export hooks
        │
        ├── 📁 layouts/               # Layout components (wrappers for pages)
        │   └── UserLayout.jsx        # Layout for user pages (header, footer, navigation)
        │
        ├── 📁 pages/                 # Page components (route components)
        │   ├── 📁 auth/
        │   │   ├── Login.jsx         # Login page
        │   │   └── Register.jsx      # Register page
        │   └── 📁 dashboard/
        │       └── Dashboard.jsx     # Dashboard page
        │
        ├── 📁 services/               # API services and HTTP utilities
        │   ├── axiosClient.js        # Axios instance with interceptors (auth, error handling)
        │   ├── http.ts               # HTTP wrapper (get, post, put, patch, delete)
        │   └── index.js              # Export services
        │
        ├── 📁 types/                  # TypeScript type definitions
        │   └── global.d.ts           # Global type declarations (module declarations)
        │
        ├── 📄 index.css              # Global CSS styles
        └── 📄 vite-env.d.ts          # Vite environment types
```

---

## 📋 Detailed Explanation of Each Folder/File

### 🔧 Configuration Files (Root Level)

#### `package.json`
- **Function**: Manages dependencies, scripts, and project metadata
- **Main Content**:
  - Dependencies: React, React Router, Axios, Tailwind CSS, Framer Motion, etc.
  - Scripts: `dev`, `build`, `lint`, `preview`, `typecheck`
- **Note**: This file defines all packages needed for the project

#### `vite.config.js`
- **Function**: Configures Vite build tool
- **Main Configuration**:
  - React plugin with automatic JSX runtime
  - Server port (5173)
  - ESBuild settings
- **Note**: This is the build system configuration file, no need to import React in code

#### `tsconfig.json`
- **Function**: Configures TypeScript compiler
- **Main Configuration**:
  - JSX: `react-jsx` (automatic JSX transform)
  - Module resolution: Bundler
  - Path aliases: `@/*` → `src/*`
- **Note**: Enables TypeScript usage in the project

#### `eslint.config.js`
- **Function**: Configures ESLint (code linting and formatting rules)
- **Note**: Helps maintain code quality and consistency

#### `index.html`
- **Function**: HTML entry point of the application
- **Note**: Vite will inject the React app here

---

### 📁 src/ - Main Source Code

#### 📄 Entry Points

##### `main.jsx`
- **Function**: Entry point of the React application
- **Responsibilities**:
  - Import global CSS
  - Render App component to DOM
  - Wrap in StrictMode to detect potential problems
- **Note**: This is the first file executed when the app runs

##### `App.jsx`
- **Function**: Root component, defines routing structure
- **Responsibilities**:
  - Setup React Router with BrowserRouter
  - Define routes (login, register, dashboard)
  - Wrap routes with UserLayout
  - Include ErrorToast and ScrollToTop components
- **Routes**:
  - `/login` → LoginPage
  - `/register` → RegisterPage
  - `/` → UserLayout (with nested routes)
  - `/` (index) → Redirect to `/dashboard`

---

#### 📁 components/ - Reusable Components

##### `components/common/LoadingSpinner.jsx`
- **Function**: Component to display loading indicator
- **Usage**: When fetching data or processing

##### `components/common/ScrollToTop.jsx`
- **Function**: Automatically scroll to top of page when route changes
- **Usage**: Improves UX when navigating between pages

##### `components/ErrorToast.jsx`
- **Function**: Component to display error messages as toast notifications
- **Usage**: Display errors from API or validation

---

#### 📁 constants/ - Constants

##### `constants/index.ts`
- **Function**: Defines all constants in the app
- **Content**:
  - `ENV`: Environment variables
  - `API_ENDPOINTS`: API endpoint paths
  - `ROUTES`: Route paths
  - `STORAGE_KEYS`: LocalStorage keys
  - `HTTP_STATUS`: HTTP status codes
- **Note**: Centralized constants make it easier to maintain and refactor

---

#### 📁 contexts/ - React Context

##### `contexts/AuthContext.jsx`
- **Function**: Context to manage authentication state
- **Status**: Not implemented yet (TODO)
- **Will contain**: User info, login/logout functions, token management
- **Note**: When implemented, will wrap App in AuthProvider

---

#### 📁 hooks/ - Custom Hooks

##### `hooks/auth/useAuth.jsx`
- **Function**: Custom hook to access AuthContext
- **Usage**: `const { user, login, logout } = useAuth()`
- **Note**: Makes it easy to use auth context in components

---

#### 📁 layouts/ - Layout Components

##### `layouts/UserLayout.jsx`
- **Function**: Layout wrapper for user pages
- **Responsibilities**:
  - Contains header, navigation, sidebar (to be implemented)
  - Renders `<Outlet />` to display nested routes
  - Contains footer (to be implemented)
- **Usage**: Wrap routes that need common layout

---

#### 📁 pages/ - Page Components

##### `pages/auth/Login.jsx`
- **Function**: Login page
- **Status**: Not implemented yet (TODO)
- **Will contain**: Login form, validation, API call

##### `pages/auth/Register.jsx`
- **Function**: Register page
- **Status**: Not implemented yet (TODO)
- **Will contain**: Register form, validation, API call

##### `pages/dashboard/Dashboard.jsx`
- **Function**: Main dashboard page
- **Status**: Not implemented yet (TODO)
- **Will contain**: Overview, statistics, charts, etc.

---

#### 📁 services/ - API Services

##### `services/axiosClient.js`
- **Function**: Axios instance with interceptors
- **Features**:
  - **Request Interceptor**:
    - Automatically adds Authorization header from localStorage
    - Logs requests in development mode
  - **Response Interceptor**:
    - Automatically extracts response.data
    - Handles errors (401 → redirect to login, 403, 500)
    - Logs responses in development mode
- **Note**: This is where authentication and error handling are centralized

##### `services/http.ts`
- **Function**: HTTP wrapper methods
- **Methods**: `get`, `post`, `put`, `patch`, `delete`
- **Usage**: Instead of using axiosClient directly, use http wrapper
- **Example**: `http.get('/users')`, `http.post('/auth/login', data)`

---

#### 📁 types/ - TypeScript Types

##### `types/global.d.ts`
- **Function**: Global type declarations
- **Content**: Module declarations for file types (.scss, .png, .jpg, .svg)
- **Note**: Allows importing these file types in TypeScript

##### `vite-env.d.ts`
- **Function**: Vite environment types
- **Note**: Defines types for Vite environment variables

---

#### 📄 Styling

##### `index.css`
- **Function**: Global CSS styles
- **Content**: Base styles, CSS reset, global utilities
- **Note**: May contain Tailwind CSS directives

---

## 🔄 Data Flow

```
User Action
    ↓
Page Component (Login.jsx, Dashboard.jsx, etc.)
    ↓
Custom Hook (useAuth.jsx) or Direct API Call
    ↓
HTTP Service (http.ts)
    ↓
Axios Client (axiosClient.js)
    ↓
API Backend
    ↓
Response → Interceptors → Component State Update
```

---

## 🎯 Best Practices Applied

1. **Separation of Concerns**: 
   - Components only handle UI
   - Services handle API calls
   - Contexts handle global state

2. **Code Organization**:
   - Feature-based folder structure (auth/, dashboard/)
   - Common components separated
   - Constants centralized

3. **Type Safety**:
   - TypeScript for type checking
   - Type definitions in types/

4. **Error Handling**:
   - Centralized in axiosClient interceptors
   - ErrorToast component for user feedback

5. **Authentication**:
   - Token management in axiosClient
   - Auto redirect when unauthorized

---

## 📝 Notes

- **Not implemented yet**: AuthContext, pages, detailed UserLayout
- **Already set up**: Routing, HTTP client, Error handling, Constants
- **Tech Stack**: React 19, React Router 6, Vite, TypeScript, Tailwind CSS, Axios

---

## 🚀 Next Steps (When Implementing)

1. Implement AuthContext with login/logout logic
2. Implement Login and Register pages with forms
3. Implement Dashboard with data visualization
4. Implement UserLayout with header, navigation, footer
5. Add more routes and pages according to requirements
6. Connect to backend API
