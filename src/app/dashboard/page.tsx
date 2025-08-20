'use client'
import useAuth from "@/hooks/useAuth";
import { fetchLogout } from "@/services/api";
import { signOut } from "next-auth/react";


export default function Dashboard () {
    const { session } = useAuth()
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