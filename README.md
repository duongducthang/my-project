# React Base App

A modern React base project template with Vite, TypeScript, Tailwind CSS, and React Router.

## 🚀 Features

- ⚡️ **Vite** - Fast build tool and dev server
- ⚛️ **React 19** - Latest React with automatic JSX runtime
- 📘 **TypeScript** - Type safety and better DX
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🧭 **React Router 6** - Client-side routing
- 🔌 **Axios** - HTTP client with interceptors
- 🎯 **ESLint** - Code linting and formatting
- 📦 **Organized Structure** - Feature-based folder organization

## 📁 Project Structure

See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for detailed documentation.

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

App will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

### Type Check

```bash
npm run typecheck
```

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3000/api
VITE_ENABLE_MOCKS=false
```

## 🎯 Next Steps

1. Update constants in `src/constants/index.ts`
2. Implement authentication in `src/contexts/AuthContext.jsx`
3. Create your pages in `src/pages/`
4. Connect to your backend API
5. Customize styling with Tailwind CSS

## 📚 Tech Stack

- **React** 19.1.0
- **React Router** 6.30.1
- **Vite** 4.5.2
- **TypeScript** 5.9.2
- **Tailwind CSS** 3.4.1
- **Axios** 1.11.0
- **Framer Motion** 12.23.12

## 📄 License

MIT
