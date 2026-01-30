import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import type { PluginOption } from 'vite';

// Security Headers Plugin
function securityHeadersPlugin(env: Record<string, string>): PluginOption {
  // Get API origin from environment variable
  const getApiOrigin = () => {
    const apiUrl = env.VITE_API_BASE_URL || 'https://api.yourdomain.com';
    try {
      return new URL(apiUrl).origin;
    } catch {
      return apiUrl;
    }
  };

  // Get CDN origin from environment variable
  const getCdnOrigin = () => {
    const cdnUrl = env.VITE_CDN_URL || '';
    if (!cdnUrl) return '';
    try {
      return new URL(cdnUrl).origin;
    } catch {
      return cdnUrl;
    }
  };

  const apiOrigin = getApiOrigin();
  const cdnOrigin = getCdnOrigin();
  
  // Build CSP directives
  const buildCsp = () => {
    const scriptSrc = [
      "'self'",
      "https://fonts.googleapis.com",
      // Add GTM domain if enabled
      ...(env.VITE_GTM_ID ? ["https://www.googletagmanager.com"] : []),
      // Add Sentry domain if enabled
      ...(env.VITE_SENTRY_DSN ? ["https://browser.sentry-cdn.com"] : []),
      // Allow inline scripts with nonce for development and build-time scripts
      "'unsafe-inline'",
    ].join(' ');

    const connectSrc = [
      "'self'",
      apiOrigin,
      // Add CDN if configured
      ...(cdnOrigin ? [cdnOrigin] : []),
      // Add analytics domains
      "https://www.google-analytics.com",
      "https://stats.g.doubleclick.net",
      // Add Sentry if enabled
      ...(env.VITE_SENTRY_DSN ? ["https://sentry.io"] : []),
    ].join(' ');

    return [
      "default-src 'self'",
      `script-src ${scriptSrc}`,
      "style-src 'self' https://fonts.googleapis.com 'unsafe-inline'",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      `connect-src ${connectSrc}`,
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests"
    ].join('; ');
  };

  return {
    name: 'security-headers',
    configureServer(server) {
      server.middlewares.use((_req, res, next) => {
        // Content Security Policy with dynamic origins
        res.setHeader('Content-Security-Policy', buildCsp());

        // Strict Transport Security
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

        // Frame Protection
        res.setHeader('X-Frame-Options', 'DENY');

        // MIME Type Sniffing Protection
        res.setHeader('X-Content-Type-Options', 'nosniff');

        // Referrer Policy
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Permissions Policy
        res.setHeader(
          'Permissions-Policy',
          'geolocation=(), microphone=(), camera=(), payment=(), usb=()'
        );

        // Additional COOP/COEP headers
        res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
        res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');

        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((_req, res, next) => {
        // Apply same headers to preview server
        res.setHeader('Content-Security-Policy', buildCsp());
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        res.setHeader(
          'Permissions-Policy',
          'geolocation=(), microphone=(), camera=(), payment=(), usb=()'
        );
        res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
        res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');

        next();
      });
    },
    generateBundle(_options, bundle) {
      // Add security headers to HTML files in build
      Object.keys(bundle).forEach((fileName) => {
        if (fileName.endsWith('.html')) {
          const file = bundle[fileName] as any;
          if (file.type === 'asset' && typeof file.source === 'string') {
            // Inject CSP meta tag with dynamic origins
            const cspMeta = `<meta http-equiv="Content-Security-Policy" content="${buildCsp()}">`;

            // Insert CSP meta tag unconditionally after <head> opening
            if (file.source.includes('<head>')) {
              file.source = file.source.replace('<head>', '<head>\n    ' + cspMeta);
            } else {
              // Fallback: insert after first meta tag
              file.source = file.source.replace(/(<meta[^>]*>)/, '$1\n    ' + cspMeta);
            }
          }
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Load environment variables for the current mode
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      react(), 
      securityHeadersPlugin(env)
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@/components': path.resolve(__dirname, './src/components'),
        '@/pages': path.resolve(__dirname, './src/pages'),
        '@/hooks': path.resolve(__dirname, './src/hooks'),
        '@/utils': path.resolve(__dirname, './src/utils'),
        '@/types': path.resolve(__dirname, './src/types'),
        '@/assets': path.resolve(__dirname, './src/assets'),
        '@/styles': path.resolve(__dirname, './src/styles'),
      },
    },
    build: {
      // Output directory
      outDir: 'dist',

      // Generate sourcemaps for production debugging
      sourcemap: mode === 'production' ? 'hidden' : true,

      // Minification
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production',
          pure_funcs: mode === 'production' ? ['console.log', 'console.info'] : [],
        },
      },

      // Chunk size warning limit
      chunkSizeWarningLimit: 1000,

      // Rollup options for code splitting
      rollupOptions: {
        output: {
          // Manual chunk splitting strategy - optimized for better caching
          manualChunks: {
            // React core - separate for better caching
            'react-core': ['react', 'react-dom'],

            // React Router - separate for route-based splitting
            'react-router': ['react-router-dom'],

            // I18n libraries - separate for internationalization
            i18n: ['i18next', 'react-i18next'],

            // UI component libraries - external dependencies
            'ui-vendor': ['@headlessui/react', '@heroicons/react', 'clsx', 'tailwind-merge'],

            // Utility libraries
            utils: ['date-fns', 'lodash-es'],

            // Chart libraries - loaded on demand
            charts: ['recharts', 'chart.js', 'react-chartjs-2'],

            // Form libraries
            forms: ['react-hook-form', '@hookform/resolvers', 'yup', 'zod'],

            // State management
            state: ['zustand', '@tanstack/react-query'],

            // Animation libraries
            animations: ['framer-motion', '@react-spring/web'],
          },

          // Asset file naming with content hash
          assetFileNames: (assetInfo: { name?: string }) => {
            if (/(png|jpe?g|svg|gif|tiff|bmp|ico|webp|avif)$/i.test(assetInfo.name || '')) {
              return `assets/images/[name]-[hash][extname]`;
            }
            if (/(woff2?|eot|ttf|otf)$/i.test(assetInfo.name || '')) {
              return `assets/fonts/[name]-[hash][extname]`;
            }
            if (/(css|scss|sass|less)$/i.test(assetInfo.name || '')) {
              return `assets/styles/[name]-[hash][extname]`;
            }
            return `assets/[name]-[hash][extname]`;
          },

          // Chunk file naming with hash for caching
          chunkFileNames: (_chunkInfo: any) => {
            return `assets/js/[name]-[hash].js`;
          },
          entryFileNames: 'assets/js/[name]-[hash].js',
        },

        // Optimize bundle size
        onwarn(warning: any, warn: any) {
          // Suppress warnings about dynamic imports
          if (warning.code === 'DYNAMIC_IMPORT') return;
          warn(warning);
        },
      },

      // CSS code splitting
      cssCodeSplit: true,

      // Asset inline limit (10KB)
      assetsInlineLimit: 10240,

      // Module preloading for better performance
      modulePreload: {
        polyfill: true,
        resolveDependencies: (_filename: string, deps: string[]) => {
          // Prioritize critical dependencies
          return deps.filter(
            (dep: string) =>
              dep.includes('react') || dep.includes('react-dom') || dep.includes('react-router-dom')
          );
        },
      },

      // Target modern browsers for better optimization
      target: ['es2020', 'chrome80', 'firefox78', 'safari13'],

      // Optimize dependencies
      optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom', 'i18next', 'react-i18next'],
        exclude: [
          // Exclude large dependencies from pre-bundling
          'recharts',
          'chart.js',
          'framer-motion',
        ],
      },
    },

    // Server configuration
    server: {
      port: 3000,
      strictPort: false,
      open: true,
      // HTTPS enforcement middleware
      https: false, // Set to true in production with proper certificates
    },

    // Preview configuration
    preview: {
      port: 4173,
      strictPort: false,
    },
  };
});
