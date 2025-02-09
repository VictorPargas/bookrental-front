"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./components/Sidebar";
import { ReactNode, useEffect, useState } from "react";
import store from "./hooks/redux/store";
import { Provider } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import Loading from "./components/Loading";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

interface Props {
  children: ReactNode;
}

export default function RootLayout({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsAuthenticated(!!token);  // Verifica se o token existe

    // Redireciona para login se tentar acessar rota privada sem estar autenticado
    if (!token && !publicRoutes.includes(pathname)) {
      router.push('/auth');
    }
  }, [pathname, router]);

  const publicRoutes = [
    '/auth', '/auth/create', '/auth/forgot-password', '/auth/confirm-email'
  ];

  const isPublicRoute = publicRoutes.includes(pathname);

  return (
    <html lang="pt">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <title>Gerencia Livros</title>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Provider store={store}>
          <div className="content-wrapper d-flex">
            {!isPublicRoute && isAuthenticated && <Sidebar />} {/* Sidebar só aparece se autenticado */}
            <main className="flex-grow-1 p-4">
              {children}
            </main>
          </div>
          <Loading />
          <ToastContainer />
        </Provider>       
      </body>
    </html>
  );
}
