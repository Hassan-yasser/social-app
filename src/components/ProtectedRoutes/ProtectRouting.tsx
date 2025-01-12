"use client";
import Loading from "@/imgs/app/loading";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectRouting({ children }: { children: React.ReactNode }) {
  const Router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      Router.push("/login");
    }
  }, [Router]);


  if (isAuthenticated === null) {
    return <Loading/>
  }


  return <>{children}</>;
}