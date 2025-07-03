'use client'
import { Animal } from "@/types/interfaces";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ReadonlyURLSearchParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";


interface AnimalCardListProp {
    animals: Animal[];
}
export default function AnimalCardList ({ animals }: AnimalCardListProp) {
    const router: AppRouterInstance = useRouter();
    const findParams: ReadonlyURLSearchParams = useSearchParams();
    const categoryParams = findParams.getAll('category') || [];
    const searchParams = findParams.get('search') || "";
    const [currentAnimal, setCurrentAnimal] = useState<Animal[]>(animals);
    useEffect(() => {
        const filtered = animals.filter(anim => {
            const categoryMatch = categoryParams.length === 0 || categoryParams.includes(anim?.category?.name);
            // Filter pencarian: hanya lulus jika searchParams kosong atau anim.type mengandung searchParams
            const searchMatch = searchParams === '' || anim.type.toLowerCase().includes(searchParams.toLowerCase());
            return categoryMatch && searchMatch
        })
        setCurrentAnimal(filtered)
    }, [findParams]);
    // console.log(animal)
    const handleRouter = (animalId: number) => {
        router.push(`/animal/${animalId}`);
    }

    return (
        <section className="flex flex-row gap-[0.6rem] md:gap-[1rem] xl:gap-[2rem] flex-wrap w-fit justify-center">
        {currentAnimal.map((animal) => (
            <div className="flex flex-col bg-amber-50 rounded-[1rem] w-[9rem] md:w-[14rem] xl:w-[20rem] shadow-lg/30 ring-[0.1rem] ring-black/5">
                <img src={animal?.images?.[0]} className="object-cover w-full rounded-t-[1rem] h-[8rem] md:h-[10rem] xl:h-[15rem]" alt={animal?.type} />
                <div className="flex flex-col text-center px-[1rem]">
                    <h4 className="font-extralight">{animal?.type?.slice(0,14)}{animal?.type?.length > 15 ? '...' : ''}</h4>
                    <p className="pb-[0rem] md:pb-[1rem]">Category: {animal?.category?.name}</p>
                    <p className="text-justify hidden md:block">{animal?.description.slice(0,78)}{animal?.description?.length > 78 ? '...' : ''}</p>
                </div>
                <div className="flex flex-col items-center gap-[1rem] px-[0.5rem] md:px-[1rem] xl:px-[2rem] py-[0.5rem] md:py-[1rem]">
                    <p className="font-bold">Rp {animal?.price}</p>
                    <div className="flex flex-row gap-[0.3rem] md:gap-[2rem] md:justify-between w-[100%]">
                        <button onClick={() => handleRouter(animal?.id)} className="btn bg-emerald-500 hover:bg-emerald-700 hover:text-white xl:1rem transition-opacity delay-200 active:scale-90">See Detail</button>
                        <button className="btn bg-emerald-500 hover:bg-emerald-700 hover:text-white transition-opacity delay-200 active:scale-90">Buy</button>
                    </div>
                </div>
            </div>
        ))}
        {/* yg bawak mock semua */}
        {currentAnimal.map((animal) => (
            <div className="flex flex-col bg-amber-50 rounded-[1rem] w-[9rem] md:w-[14rem] xl:w-[20rem] shadow-lg/30 ring-[0.1rem] ring-black/5">
                <img src={animal?.images?.[0]} className="object-cover w-full rounded-t-[1rem] h-[8rem] md:h-[10rem] xl:h-[15rem]" alt={animal?.type} />
                <div className="flex flex-col text-center px-[1rem]">
                    <h4 className="font-extralight">{animal?.type?.slice(0,14)}{animal?.type?.length > 15 ? '...' : ''}</h4>
                    <p className="pb-[0rem] md:pb-[1rem]">Category: {animal?.category?.name}</p>
                    <p className="text-justify hidden md:block">{animal?.description.slice(0,78)}{animal?.description?.length > 78 ? '...' : ''}</p>
                </div>
                <div className="flex flex-col items-center gap-[1rem] px-[0.5rem] md:px-[1rem] xl:px-[2rem] py-[0.5rem] md:py-[1rem]">
                    <p className="font-bold">Rp {animal?.price}</p>
                    <div className="flex flex-row gap-[0.3rem] md:gap-[2rem] md:justify-between w-[100%]">
                        <button onClick={() => handleRouter(animal?.id)} className="btn bg-emerald-500 hover:bg-emerald-700 hover:text-white xl:1rem transition-opacity delay-200 active:scale-90">See Detail</button>
                        <button className="btn bg-emerald-500 hover:bg-emerald-700 hover:text-white transition-opacity delay-200 active:scale-90">Buy</button>
                    </div>
                </div>
            </div>
        ))}
        {currentAnimal.map((animal) => (
            <div className="flex flex-col bg-amber-50 rounded-[1rem] w-[9rem] md:w-[14rem] xl:w-[20rem] shadow-lg/30 ring-[0.1rem] ring-black/5">
                <img src={animal?.images?.[0]} className="object-cover w-full rounded-t-[1rem] h-[8rem] md:h-[10rem] xl:h-[15rem]" alt={animal?.type} />
                <div className="flex flex-col text-center px-[1rem]">
                    <h4 className="font-extralight">{animal?.type?.slice(0,14)}{animal?.type?.length > 15 ? '...' : ''}</h4>
                    <p className="pb-[0rem] md:pb-[1rem]">Category: {animal?.category?.name}</p>
                    <p className="text-justify hidden md:block">{animal?.description.slice(0,78)}{animal?.description?.length > 78 ? '...' : ''}</p>
                </div>
                <div className="flex flex-col items-center gap-[1rem] px-[0.5rem] md:px-[1rem] xl:px-[2rem] py-[0.5rem] md:py-[1rem]">
                    <p className="font-bold">Rp {animal?.price}</p>
                    <div className="flex flex-row gap-[0.3rem] md:gap-[2rem] md:justify-between w-[100%]">
                        <button onClick={() => handleRouter(animal?.id)} className="btn bg-emerald-500 hover:bg-emerald-700 hover:text-white xl:1rem transition-opacity delay-200 active:scale-90">See Detail</button>
                        <button className="btn bg-emerald-500 hover:bg-emerald-700 hover:text-white transition-opacity delay-200 active:scale-90">Buy</button>
                    </div>
                </div>
            </div>
        ))}
        {currentAnimal.map((animal) => (
            <div className="flex flex-col bg-amber-50 rounded-[1rem] w-[9rem] md:w-[14rem] xl:w-[20rem] shadow-lg/30 ring-[0.1rem] ring-black/5">
                <img src={animal?.images?.[0]} className="object-cover w-full rounded-t-[1rem] h-[8rem] md:h-[10rem] xl:h-[15rem]" alt={animal?.type} />
                <div className="flex flex-col text-center px-[1rem]">
                    <h4 className="font-extralight">{animal?.type?.slice(0,14)}{animal?.type?.length > 15 ? '...' : ''}</h4>
                    <p className="pb-[0rem] md:pb-[1rem]">Category: {animal?.category?.name}</p>
                    <p className="text-justify hidden md:block">{animal?.description.slice(0,78)}{animal?.description?.length > 78 ? '...' : ''}</p>
                </div>
                <div className="flex flex-col items-center gap-[1rem] px-[0.5rem] md:px-[1rem] xl:px-[2rem] py-[0.5rem] md:py-[1rem]">
                    <p className="font-bold">Rp {animal?.price}</p>
                    <div className="flex flex-row gap-[0.3rem] md:gap-[2rem] md:justify-between w-[100%]">
                        <button onClick={() => handleRouter(animal?.id)} className="btn bg-emerald-500 hover:bg-emerald-700 hover:text-white xl:1rem transition-opacity delay-200 active:scale-90">See Detail</button>
                        <button className="btn bg-emerald-500 hover:bg-emerald-700 hover:text-white transition-opacity delay-200 active:scale-90">Buy</button>
                    </div>
                </div>
            </div>
        ))}
        {currentAnimal.map((animal) => (
            <div className="flex flex-col bg-amber-50 rounded-[1rem] w-[9rem] md:w-[14rem] xl:w-[20rem] shadow-lg/30 ring-[0.1rem] ring-black/5">
                <img src={animal?.images?.[0]} className="object-cover w-full rounded-t-[1rem] h-[8rem] md:h-[10rem] xl:h-[15rem]" alt={animal?.type} />
                <div className="flex flex-col text-center px-[1rem]">
                    <h4 className="font-extralight">{animal?.type?.slice(0,14)}{animal?.type?.length > 15 ? '...' : ''}</h4>
                    <p className="pb-[0rem] md:pb-[1rem]">Category: {animal?.category?.name}</p>
                    <p className="text-justify hidden md:block">{animal?.description.slice(0,78)}{animal?.description?.length > 78 ? '...' : ''}</p>
                </div>
                <div className="flex flex-col items-center gap-[1rem] px-[0.5rem] md:px-[1rem] xl:px-[2rem] py-[0.5rem] md:py-[1rem]">
                    <p className="font-bold">Rp {animal?.price}</p>
                    <div className="flex flex-row gap-[0.3rem] md:gap-[2rem] md:justify-between w-[100%]">
                        <button onClick={() => handleRouter(animal?.id)} className="btn bg-emerald-500 hover:bg-emerald-700 hover:text-white xl:1rem transition-opacity delay-200 active:scale-90">See Detail</button>
                        <button className="btn bg-emerald-500 hover:bg-emerald-700 hover:text-white transition-opacity delay-200 active:scale-90">Buy</button>
                    </div>
                </div>
            </div>
        ))}

        </section>
    );
}