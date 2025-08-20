'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user?.role === "CUSTOMER") {
      router.replace("/dashboard");
    } else if (session?.user?.role === "BREEDER") {
      router.replace("/dashboard");
    } else if (session?.user?.role === "ADMIN") {
      router.replace("/dashboard");
    }
  }, [status, session, router]);

  return { session, router };
}