# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Production Build Optimizations

This project includes several optimizations for production builds:

### Compression
- **vite-plugin-compression2**: Generates both gzip and brotli compressed assets
  - Compresses files > 10KB
  - Targets: JavaScript, CSS, HTML, JSON, text, and SVG files
  - Outputs: `.gz` and `.br` files alongside originals

### Image Optimization
- **@vheemstra/vite-plugin-imagemin**: Optimizes images during build
  - Formats: JPEG, PNG, GIF, SVG
  - Plugins:
    - mozjpeg: 80% quality
    - pngquant: 60-90% quality
    - gifsicle: Optimization level 7
    - svgo: SVG optimization with custom plugins

### Bundle Analysis
- **rollup-plugin-visualizer**: Generates bundle analysis
  - Run `npm run build:analyze`
  - View `dist/stats.html` for detailed bundle breakdown
  - Helps identify large dependencies and optimization opportunities

### Rolldown Compatibility
- The project uses `rolldown-vite@7.2.5` with the following compatibility notes:
  - All optimization plugins are loaded dynamically
  - Build will continue with warnings if optional plugins fail to load
  - Some peer dependency warnings may appear but can be safely ignored

### Available Scripts
- `npm run build`: Create production build
- `npm run build:analyze`: Create production build with bundle analysis
- `npm run preview`: Preview production build locally

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
