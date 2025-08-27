'use client'
import { Session } from 'next-auth'

interface NavigationAdminProps {
    session: Session | null,
}
export default function NavigationAdmin ({ session }: NavigationAdminProps) {
    return (
        <header className="flex flex-row text-[rgb(240,230,226)] bg-[#180c05] min-w-screen p-[1rem] px-[2rem] justify-end lg:justify-between">
            <img data-testid="imgDeShopper" src='/smafarm-logo.png' className="w-[5rem] max-lg:hidden" />
            <div className="flex flex-row items-center gap-[1rem]">
                <img data-testid="userAvatar" src={session?.user.profile?.img_profile} className="w-[2rem] rounded-[50%]" />
                <p>{session?.user?.name}</p>
            </div>
        </header>
    );
}