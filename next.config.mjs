import withPWA from "next-pwa";

const nextConfig = {
  // Otras configuraciones de Next.js van aquí (ej. images, i18n, etc.)
  reactStrictMode: true,
  turbopack: {}, // Habilitar Turbopack (experimental)
  images: {
    remotePatterns: [
      {
        hostname: "rickandmortyapi.com",
      },
    ],
  },
};
const pwaConfig = withPWA({
  dest: 'public', // Directorio donde se generará el Service Worker
  register: true, // Registra automáticamente el Service Worker
  skipWaiting: true, // Forzar la activación del nuevo Service Worker
 
});


export default pwaConfig(nextConfig);
