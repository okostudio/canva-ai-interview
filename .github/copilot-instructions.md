# Canva AI Interview - Copilot Instructions

## Project Overview

This is a **React + Vite** interview project—a minimal setup for exploring React concepts with modern tooling. The application uses **SWC** for Fast Refresh and modern JavaScript modules.

**Key Stack:**
- React 19.2.0 (with hooks)
- Vite 7.2.4 (ES modules, HMR enabled)
- SWC transpiler (@vitejs/plugin-react-swc)
- ESLint 9.39.1 (no TypeScript in this setup)

## Architecture

### Component Structure
- **[src/main.jsx](src/main.jsx)** - Entry point that mounts React with StrictMode
- **[src/App.jsx](src/App.jsx)** - Root component (currently minimal demo with useState counter)
- **[src/App.css](src/App.css)** & **[src/index.css](src/index.css)** - Global and component styles
- **[index.html](index.html)** - HTML template with `<div id="root">`

### Build System
- **Vite** handles dev server with HMR (Hot Module Replacement)
- **SWC** transpiles JSX and modern JS (faster than Babel)
- Output goes to `dist/` (default Vite behavior)

## Developer Workflows

### Starting Development
```bash
npm run dev
```
Starts Vite dev server on `http://localhost:5173` with HMR enabled. Changes to `.jsx` files trigger instant browser refresh.

### Building for Production
```bash
npm run build
```
Creates optimized bundle in `dist/` directory. Use `npm run preview` to test the production build locally.

### Linting
```bash
npm lint
```
Runs ESLint across the entire project. Configuration is in [eslint.config.js](eslint.config.js).

## Key Patterns & Conventions

### React Usage
- **Hooks-based** - Use `useState`, `useEffect`, etc. No class components.
- **JSX imports** - React is automatically imported via JSX transform; no explicit `import React` needed.
- **File naming** - Components use `.jsx` extension (e.g., `App.jsx`), utilities use `.js`.

### CSS
- **Co-located styles** - Component CSS lives alongside JSX (e.g., `App.jsx` + `App.css`)
- **Global styles** - [src/index.css](src/index.css) contains page-level defaults
- **Asset imports** - SVG and image assets imported as modules: `import viteLogo from '/vite.svg'`

### Module System
- **ES Modules** only (`"type": "module"` in [package.json](package.json))
- Import paths are relative; no alias configuration
- `node_modules` excluded from source control

## Important Considerations

### SWC Configuration Note
The **React Compiler is not compatible with SWC** (tracking issue: https://github.com/vitejs/vite-plugin-react/issues/428). If React Compiler support becomes critical, switch to `@vitejs/plugin-react` (Babel-based) in [vite.config.js](vite.config.js).

### Development vs Production
- **HMR active in dev** - Vite's hot reload works automatically for JSX/CSS changes
- **No TypeScript** - This template uses plain JavaScript; consider migrating to TS for production applications
- **ESLint only** - No type checking; consider adding TypeScript if stricter type safety is needed

## Common Tasks

| Task | Command |
|------|---------|
| Start dev server | `npm run dev` |
| Build for production | `npm run build` |
| Preview production build | `npm run preview` |
| Check linting | `npm lint` |
| Install dependencies | `npm install` |

## Next Steps for Development

When expanding this codebase:
1. Add new components in `src/` as `.jsx` files
2. Import and use them in `App.jsx`
3. Add component-specific CSS files alongside `.jsx`
4. Keep utilities/helpers as `.js` files if needed
5. Run `npm lint` before committing to catch style issues
