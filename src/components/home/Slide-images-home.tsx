'use client'
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

interface SlideImagesHomeProp {
    imageCategory: string[]
}
export default function SlideImagesHome({ imageCategory }: SlideImagesHomeProp) {
    const [currentImage, setCurrentImage] = useState<number>(0);
    const router: AppRouterInstance = useRouter();

    useEffect(() => {
        const intervalImageHome = setInterval (() => {
            setCurrentImage((prev) => (prev + 1) % imageCategory.length);
        }, 2000);
        return () => {
            clearInterval(intervalImageHome)
        }
    }, [])
    return (
        <section className="flex flex-col w-screen h-screen bg-cover bg-center justify-center items-start px-[2rem] sm:px-[0rem] md:px-[6rem] xl:px-[15rem] 2xl:px-[35rem]" style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.6) 80%, rgb(109,121,0)), url(${imageCategory[currentImage]})`}}>
        <p className="text-white leading-none font-medium">You need</p>
        <h1 className="leading-none text-amber-600 font-bold">Livestock <span className="text-[0.8rem] md:text-[1.5rem] lg:text-[3rem] text-emerald-500 font-medium">or care service?</span></h1>
            <div className="flex gap-[2rem]">
                <button onClick={() => router.push('/animal')} className="btn bg-emerald-500 text-black shadow-lg font-bold hover:bg-emerald-700 hover:text-white duration-200">Livestock</button>
                <button onClick={() => router.push('/shelter')} className="btn bg-emerald-500 text-black shadow-lg font-bold hover:bg-emerald-700 hover:text-white duration-200">Shelter</button>
            </div>
        </section>
    )
}