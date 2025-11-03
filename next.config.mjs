import withPWA from "next-pwa";

const nextConfig = {
  // Otras configuraciones de Next.js van aquí (ej. images, i18n, etc.)
  reactStrictMode: true,

  typescript: {
    ignoreBuildErrors: false, // cámbialo a true solo si sigue fallando
  },


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
  disable: process.env.NODE_ENV === "development", // Desactiva PWA en modo dev
 
});


export default pwaConfig(nextConfig);
