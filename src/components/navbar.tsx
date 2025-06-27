'use client'
import { AlignJustify, CircleUserRound, Home, Rabbit, ShoppingCart, Warehouse, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
    const [show, setShow] = useState<boolean>(true);
    const lastPosition = useRef<number>(0);
    const [menu, setMenu] = useState<boolean>(false);
    const handleScroll = () => {
        const currentPosition = window.scrollY;
        setShow(currentPosition > lastPosition.current && currentPosition > 50 ? false : true);
        lastPosition.current = currentPosition;
    };
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, [])
    return(
        <div className="flex justify-center">
            <header className={`w-[98vw] lg:h-fit flex flex-col lg:flex-row justify-between bg-gray-400 mt-[1rem] p-[0.5rem] items-center rounded-[1rem] duration-500 fixed lg:gap-[2rem] gap-[1rem] overflow-hidden ${show ? "translate-y-0" : "-translate-y-full"} transition-all duration-300 ease-in-out ${menu ? 'h-[23rem]' : 'h-[3.3rem]'}`}>
                <div className="w-full flex justify-between items-center lg:w-auto">
                    <p>SmaFarm</p>
                    <button onClick={() => setMenu(!menu)} className="lg:hidden w-auto">{menu ? <X /> : <AlignJustify />}</button>
                </div>
                <nav className={`lg:gap-[3rem] gap-[1rem] flex-col lg:flex-row flex`}>
                    <Link href='/' className="flex flex-col items-center text-[0.6rem] lg:text-[0.8rem]"><Home className="w-[2rem] h-[2rem] lg:w-[3rem] lg:h-[3rem]"/> Home</Link>
                    <Link href='/' className="flex flex-col items-center text-[0.6rem] lg:text-[0.8rem]"><Rabbit className="w-[2rem] h-[2rem] lg:w-[3rem] lg:h-[3rem]"/> Animals</Link>
                    <Link href='/' className="flex flex-col items-center text-[0.6rem] lg:text-[0.8rem]"><Warehouse className="w-[2rem] h-[2rem] lg:w-[3rem] lg:h-[3rem]"/> Shelter</Link>
                    <Link href='/' className="flex flex-col items-center text-[0.6rem] lg:text-[0.8rem]"><ShoppingCart className="w-[2rem] h-[2rem] lg:w-[3rem] lg:h-[3rem]"/> Cart</Link>
                </nav>
                <nav className={`flex  gap-[2rem] flex-col lg:flex-row lg:flex`}>
                    <Link href='/' className="flex flex-col items-center text-[0.6rem] lg:text-[0.8rem]"><CircleUserRound className="w-[2rem] h-[2rem] lg:w-[3rem] lg:h-[3rem]"/> Guest</Link>
                </nav>
            </header>
        </div>
    )
}