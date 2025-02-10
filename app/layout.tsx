"use client"

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
import { BiMenu } from "react-icons/bi";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

interface Props {
  children: ReactNode;
}

export default function RootLayout({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Verifica o tamanho na montagem do componente
    window.addEventListener('resize', handleResize); // Atualiza quando o tamanho da tela muda

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsAuthenticated(!!token);

    if (!token && !publicRoutes.includes(pathname)) {
      router.push('/auth');
    }
  }, [pathname, router]);

  const publicRoutes = ['/auth', '/auth/create', '/auth/forgot-password', '/auth/confirm-email'];
  const isPublicRoute = publicRoutes.includes(pathname);

  return (
    <html lang="pt">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Gerencia Livros</title>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Provider store={store}>
          <div className="d-flex flex-column flex-md-row">
            {!isPublicRoute && isAuthenticated && (
              <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} isMobile={isMobile} />
            )}

            {/* Botão do Menu Responsivo para Mobile */}
            {isMobile && !isPublicRoute && isAuthenticated && (
              <button
                className="btn btn-dark d-md-none position-fixed m-3"
                style={{ zIndex: 1100 }}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <BiMenu size={24} />
              </button>
            )}

            <main 
              className="flex-grow-1 p-3"
              style={{
                marginLeft: isMobile 
                  ? '0' // No mobile, o conteúdo ocupa toda a largura
                  : isSidebarOpen 
                    ? '280px' // Sidebar expandida no desktop
                    : '80px'  // Sidebar colapsada no desktop
              }}
            >
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
