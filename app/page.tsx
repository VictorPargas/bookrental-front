"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      router.push('/books'); 
    } else {
      router.push('/auth');   
    }
  }, [router]);

  return <></>;
}
