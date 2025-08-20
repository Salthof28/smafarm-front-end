'use client'
import { fetchLogout } from "@/services/api";
import { signOut, useSession } from "next-auth/react";
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

    const logOut = async (): Promise<void> => {
        if (!session?.accessToken) {
            console.error("No access token found");
            return;
        };
        await fetchLogout(session?.accessToken);      
        signOut({callbackUrl: "/login"});
    }
    return(
        <div>
            <h1>hai {session?.user.name}: {session?.user.role}</h1>
            <button onClick={logOut} className="bg-emerald-500 p-[0.3rem] xl:p-[0.5rem] rounded-[0.4rem] text-[0.8rem] xl:text-[1rem]">Sign Out</button>
        </div>
    )
}