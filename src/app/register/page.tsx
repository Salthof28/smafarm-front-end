'use client'
import Navbar from "@/components/navbar";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";



export default function Register () {
    const activeIconNav: string = 'login'; 
    // const handleRegister = () => {}
    return(
        <div className="bg-amber-100 w-full flex flex-col items-center min-h-screen overflow-x-hidden">
            <Navbar activeIconNav={activeIconNav}/>
            <main className="flex items-center flex-col justify-center min-h-[100vh]">
                <form className="flex flex-col bg-amber-50 p-[2rem] pt-[1rem] gap-[1rem] rounded-[1rem] w-[15rem] lg:w-[25rem] text-black">
                    <Link href="/login"><ArrowLeft /></Link>
                    <h4 className="font-extrabold text-[1rem] lg:text-[2.5rem]">Register Page</h4>
                    <input data-testid="inptName" type="text" name="name" placeholder="name" className="border p-[0.2rem] lg:p-[0.5rem] rounded-[0.6rem] text-[1rem] lg:text-[1.5rem]"/>
                    <input data-testid="inptEmail" type="email" name="email" placeholder="email@mail.com" className="border p-[0.2rem] lg:p-[0.5rem] rounded-[0.6rem] text-[1rem] lg:text-[1.5rem]"/>
                    <input data-testid="inptPassword" type="password" name="password" placeholder="Passsword" className="border p-[0.2rem] lg:p-[0.5rem] rounded-[0.6rem] text-[1rem] lg:text-[1.5rem]"/>
                    <button data-testid="btnRegister" type="submit" className="bg-emerald-500 rounded-[0.4rem] hover:bg-emerald-700 hover:text-white active:scale-95 duration-200 p-[0.2rem] lg:p-[0.5rem]" >Register</button>
                </form>
            </main>
        </div>
    )
}