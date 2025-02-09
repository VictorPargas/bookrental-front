"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      router.push('/books');  // Redireciona para /books se o token existir
    } else {
      router.push('/auth');   // Redireciona para /auth se não estiver autenticado
    }
  }, [router]);

  return <></>;
}
