'use client'
import { AlignJustify, CircleUserRound, Home, Rabbit, ShoppingCart, Warehouse, X } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Link from "next/link";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";

interface NavbarProp {
    activeIconNav: string;
}
export default function Navbar({ activeIconNav }: NavbarProp) {
    const router: AppRouterInstance = useRouter();
    const findParams: ReadonlyURLSearchParams = useSearchParams();
    const categoryParams = findParams.getAll('category') || 'All';
    const [show, setShow] = useState<boolean>(true);
    const lastPosition = useRef<number>(0);
    const [menu, setMenu] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    const handleScroll = (): void => {
        const currentPosition = window.scrollY;
        setShow(currentPosition > lastPosition.current && currentPosition > 50 ? false : true);
        lastPosition.current = currentPosition;
    };
    const getInputSearch = (e: ChangeEvent<HTMLInputElement>): void => {
        setSearch(e.target.value);

    }

    const handleInptSearch = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const currentCatParam: string[] = categoryParams;
        console.log(`cat: ${currentCatParam}`);
        if(activeIconNav === 'animal') {
            console.log(`search Animal: ${search}`);
        }
        else {
            console.log(`search Shelter: ${search}`);
        }
        
        updateParams(currentCatParam);
    }
    const updateParams = useCallback((catParams: string[]) => {
            const params = new URLSearchParams(findParams.toString());
            // delete old params
            params.delete('category');
            params.delete('search');
            // add new params
            catParams.forEach((cat) => params.append('category', cat));
            if(search !== "" && !/[=&]/.test(search)) {
                params.append('search', search)
            }
            if(activeIconNav === 'animal') {
                router.push(`/livestock?${params.toString()}`);
            }
            else {
                router.push(`/shelter?${params.toString()}`);
            }
            
    }, [search])
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, [])
    return(
        <div className="flex justify-center">
            <header className={`w-[98vw] flex flex-col lg:h-fit bg-black/80 text-white mt-[1rem] p-[0.5rem] items-center rounded-[1rem] duration-500 fixed overflow-hidden ${show ? "translate-y-0" : "-translate-y-full"} transition-all duration-300 ease-in-out ${menu ? 'h-[23rem]' : 'h-[2.5rem]'}`}>
                <div className="w-full flex flex-col lg:flex-row justify-between lg:h-fit lg:gap-[2rem] gap-[1rem] ">
                    <div className="w-full flex justify-between items-center lg:w-auto">
                        <img src='/smafarm-logo.png' className="w-[4rem]" />
                        {(activeIconNav === 'animal' || activeIconNav === 'shelter') && (
                        <form className="lg:hidden" onSubmit={handleInptSearch}>
                            <input data-testid='inptSearch' onChange={getInputSearch} className="text-center bg-white/40 rounded-md hover:bg-emerald-500 p-[0.1rem] text-[0.8rem] text-white" placeholder="Search" ></input>
                            <button type="submit" data-testid="btnSearch" className="font-bold ml-2 bg-emerald-500 p-[0.1rem] rounded-md hover:bg-emerald-700 hover:text-amber-50 transition-opacity active:scale-90 duration-200 text-[0.8rem]">Search</button>   
                        </form>
                        )}
                        <button onClick={() => setMenu(!menu)} className="lg:hidden w-auto">{menu ? <X /> : <AlignJustify />}</button>
                    </div>
                    <nav className={`lg:gap-[3rem] gap-[1rem] flex-col lg:flex-row flex`}>
                        <Link href='/' className={`flex flex-col items-center text-[0.6rem] lg:text-[0.8rem] ${activeIconNav === 'home' ? 'text-green-400' : 'text-white'}`}><Home className="w-[2rem] h-[2rem] lg:w-[2.5rem] lg:h-[2.5rem] 2xl:w-[3rem] 2xl:h-[3rem]"/> Home</Link>
                        <Link href='/livestock' className={`flex flex-col items-center text-[0.6rem] lg:text-[0.8rem] ${(activeIconNav === 'animal' || activeIconNav === 'animaldetail') ? 'text-green-400' : 'text-white'}`}><Rabbit className="w-[2rem] h-[2rem] lg:w-[2.5rem] lg:h-[2.5rem] 2xl:w-[3rem] 2xl:h-[3rem]"/> Animals</Link>
                        <Link href='/shelter' className={`flex flex-col items-center text-[0.6rem] lg:text-[0.8rem] ${(activeIconNav === 'shelter' || activeIconNav === 'shelterdetail') ? 'text-green-400' : 'text-white'}`}><Warehouse className="w-[2rem] h-[2rem] lg:w-[2.5rem] lg:h-[2.5rem] 2xl:w-[3rem] 2xl:h-[3rem]"/> Shelter</Link>
                        <Link href='/cart' className={`flex flex-col items-center text-[0.6rem] lg:text-[0.8rem] ${activeIconNav === 'cart' ? 'text-green-400' : 'text-white'}`}><ShoppingCart className="w-[2rem] h-[2rem] lg:w-[2.5rem] lg:h-[2.5rem] 2xl:w-[3rem] 2xl:h-[3rem]"/> Cart</Link>
                    </nav>
                    <nav className={`flex  gap-[2rem] flex-col lg:flex-row lg:flex`}>
                        <Link href='/login' className={`flex flex-col items-center text-[0.6rem] lg:text-[0.8rem] ${activeIconNav === 'login' ? 'text-green-400' : 'text-white'}`}><CircleUserRound className="w-[2rem] h-[2rem] lg:w-[2.5rem] lg:h-[2.5rem] 2xl:w-[3rem] 2xl:h-[3rem]"/> Guest</Link>
                    </nav>
                </div>
                {(activeIconNav === 'animal' || activeIconNav === 'shelter') && (
                    <form className="max-lg:hidden" onSubmit={handleInptSearch}>
                        <input data-testid='inptSearch' onChange={getInputSearch} className="mt-[1rem] text-center bg-white/40 rounded-md hover:bg-emerald-500 p-1 text-[0.8rem] 2xl:text-[1rem] text-white" placeholder="Search" ></input>
                        <button type="submit" data-testid="btnSearch" className="font-bold ml-2 bg-emerald-500 p-1 rounded-md hover:bg-emerald-700 hover:text-amber-50 transition-opacity active:scale-90 duration-200 text-[0.8rem] 2xl:text-[1rem]">Search</button>   
                    </form>
                )}

            </header>
            
        </div>
    )
}