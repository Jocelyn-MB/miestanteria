import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  workboxOptions: {
    // Sobreescribe la configuración de rutas
    runtimeCaching: [
      {
        urlPattern: /\//, // La ruta de inicio ('/') sigue con NetworkFirst (Workbox lo maneja por defecto)
        handler: 'NetworkFirst',
        options: {
          cacheName: 'start-url',
          // ... plugins
        }
      },
      {
        urlPattern: /^https?:\/\/[^/]+\/(.+\.js|.+\.css|.+\.woff2)/i, 
        handler: 'CacheFirst', // Cacha primero para los assets estáticos
        options: {
            cacheName: 'static-assets',
            expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
            },
        },
      },
      {
        urlPattern: /.*/i, // Regla Catch-all para el resto de peticiones (páginas, JSON, etc.)
        handler: 'StaleWhileRevalidate', // Equilibrio: rápido offline, pero se actualiza en segundo plano.
        options: {
            cacheName: 'general-runtime-cache',
            expiration: {
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60, // 1 día
            },
        },
      },
    ]
  }
});

const nextConfig = withPWA({
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  turbopack: {}, // Ahora funciona con Turbopack
});

export default nextConfig;