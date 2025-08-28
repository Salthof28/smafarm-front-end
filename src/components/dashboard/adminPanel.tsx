import { House, ShoppingBag, Users, X, Menu } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Session } from 'next-auth';
import { useState } from "react";
import { fetchLogout } from "@/services/api";

interface ListDashboard {
    name: string,
    href: string,
    icon: React.ReactNode
}
interface AdminPanelProps {
    session: Session | null,
}
export default function AdminPanel ({ session }: AdminPanelProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const listDash: ListDashboard[] = [
        {
            name: 'Dashboard',
            href: '/dashboard',
            icon: (<House className="w-[1.2rem] h-[1.2rem] xl:w-[1.5rem] xl:h-[1.5rem]" />)
        },
        {
            name: 'Users',
            href: '/dashboard/users',
            icon: (<Users className="w-[1.2rem] h-[1.2rem] xl:w-[1.5rem] xl:h-[1.5rem]" />)
        },
        {
            name: 'Farms',
            href: '/dashboard/farms',
            icon: (<ShoppingBag className="w-[1.2rem] h-[1.2rem] xl:w-[1.5rem] xl:h-[1.5rem]" />)
        },
    ];
    const logOut = async (): Promise<void> => {
        if (!session?.refreshToken) {
            console.error("No access token found");
            return;
        }
        await fetchLogout(session?.refreshToken);      
        signOut({ callbackUrl: "/login" });
    }
    return (
        <div className="relative">
            {!isOpen && (
                <button data-testid='hamButton' onClick={() => setIsOpen(true)} className=" lg:hidden absolute -top-[2.8rem] left-[3rem]"><Menu /></button>
            )}
            <header data-testid='navPanel' className={`-translate-x-full lg:translate-x-0 max-lg:fixed max-md:w-full max-lg:w-[30%] max-lg:top-[0rem] text-[rgb(240,230,226)] bg-[#180c05] p-[1rem] h-screen transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' :'-translate-x-full'}`}>
                {/* Panel content */}
                <div data-testid='closePanel' onClick={() => setIsOpen(false)} className="flex justify-end lg:hidden">
                    <button ><X /></button>
                </div>
                
                <h5 className="text-[1rem] xl:text-[1.5rem] font-bold">Admin Panel</h5>
                <div className="flex flex-col pl-0 xl:pl-[1rem] py-[1rem] gap-[2rem] border-b-[0.1rem] border-gray-500/40 mb-[1rem]">
                    {listDash.map((list, index) => (
                        <Link key={index} href={list.href} className="flex flex-row items-center gap-[0.3rem] xl:gap-[0.5rem]">
                            {list.icon}
                            <p className="text-[0.8rem] xl:text-[1rem]">{list.name}</p>
                        </Link>
                    ))}
                </div>
                <div className="flex flex-col">
                    <div className="flex flex-row items-center gap-[0.5rem] mb-[1rem]">
                        <p className="flex justify-center items-center bg-indigo-900 p-[0.2rem] rounded-[50%] w-[2rem] h-[2rem] xl:w-[2.5rem] xl:h-[2.5rem] text-[0.8rem] xl:text-[1rem]">{session?.user?.name?.charAt(0).toUpperCase()}</p>
                        <div className="flex flex-col">
                            <p className="text-[0.8rem] xl:text-[1rem]">{session?.user?.name}</p>
                            <span className="text-[0.6rem] xl:text-[0.8rem]">{session?.user?.profile?.email}</span>
                        </div>
                    </div>
                    <button onClick={logOut} className="bg-emerald-500 p-[0.3rem] xl:p-[0.5rem] rounded-[0.4rem] text-[0.8rem] xl:text-[1rem]">Sign Out</button>
                </div>
            </header>
        </div>
    );
}


