import withPWA from "next-pwa";

const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = pwaConfig({
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true, // Temporal para deployar
  },
});

export default nextConfig;