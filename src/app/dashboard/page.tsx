'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function Dashboard () {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } 
        // else if (session?.user?.role === "customer") {
        //     router.push("/profile");
        // }
  }, [status, session, router]);
    return(
        <div>
            <h1>hai {session?.user.name}</h1>
        </div>
    )
}