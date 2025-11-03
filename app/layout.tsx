// app/layout.tsx
import './globals.css';
import { AuthProvider } from './components/AuthProvider';

export const metadata = {
  title: 'Paginoid',
  description: 'Gestión de lectura personal',
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        {/* Meta tags básicas */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* (Opcional) PWA o favicon */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/paginoid.ico" />
      </head>

      <body className="bg-gray-50 text-gray-900">
        {/* 🔐 El AuthProvider envuelve toda la app */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
