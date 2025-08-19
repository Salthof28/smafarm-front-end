'use client'
import { Livestock } from "@/types/interfaces";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ReadonlyURLSearchParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import FormBuyAnimal from "./form-buy";


interface AnimalCardListProp {
    livestocks: Livestock[];
}
export default function AnimalCardList ({ livestocks }: AnimalCardListProp) {
    const router: AppRouterInstance = useRouter();
    const findParams: ReadonlyURLSearchParams = useSearchParams();
    const categoryParams = findParams.getAll('category') || [];
    const searchParams = findParams.get('search') || "";
    const [currentAnimal, setCurrentAnimal] = useState<Livestock[]>(livestocks);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [selectedAnimal, setSelectedAnimal] = useState<Livestock | null>(null);

    const handleBuy = (animal: Livestock) => {
        setSelectedAnimal(animal);
        setShowForm(true);
    };
    useEffect(() => {
        const filtered = livestocks.filter(livestock => {
            const categoryMatch = categoryParams.length === 0 || categoryParams.includes(livestock?.category?.name);
            // Filter pencarian: hanya lulus jika searchParams kosong atau anim.type mengandung searchParams
            const searchMatch = searchParams === '' || livestock?.name.toLowerCase().includes(searchParams.toLowerCase());
            return categoryMatch && searchMatch
        })
        setCurrentAnimal(filtered)
    }, [findParams]);
    // console.log(animal)
    const handleRouter = (animalId: number) => {
        router.push(`/livestock/${animalId}`);
    }

    return (
        <section className={`flex flex-row gap-[0.6rem] md:gap-[1rem] xl:gap-[2rem] flex-wrap w-full justify-center ${currentAnimal.length > 0 ? 'lg:justify-start' : 'justify-center min-h-[75vh]' } min-w-[71vw] xl:min-w-[77vw] 2xl:min-w-[70vw] items-center`}>
        {currentAnimal.length > 0 ? (
            currentAnimal.map((animal) => (
                <div className="flex flex-col bg-amber-50 rounded-[1rem] w-[9rem] md:w-[14rem] xl:w-[20rem] shadow-lg/30 ring-[0.1rem] ring-black/5">
                    <img src={animal?.img_livestock[0]?.url} className="object-cover w-full rounded-t-[1rem] h-[8rem] md:h-[10rem] xl:h-[15rem]" alt={animal?.name} />
                    <div className="flex flex-col text-center px-[1rem]">
                        <h4 className="font-extralight">{animal?.name?.slice(0,14)}{animal?.name?.length > 15 ? '...' : ''}</h4>
                        <p className="pb-[0rem] md:pb-[1rem]">Category: {animal?.category?.name}</p>
                        <p className="text-justify hidden md:block">{animal?.description.slice(0,78)}{animal?.description?.length > 78 ? '...' : ''}</p>
                    </div>
                    <div className="flex flex-col items-center gap-[1rem] px-[0.5rem] md:px-[1rem] xl:px-[2rem] py-[0.5rem] md:py-[1rem]">
                        <p className="font-bold">Rp {animal?.price}</p>
                        <div className="flex flex-row gap-[0.3rem] md:gap-[2rem] md:justify-between w-[100%]">
                            <button onClick={() => handleRouter(animal?.id)} className="btn bg-emerald-500 hover:bg-emerald-700 hover:text-white xl:1rem transition-opacity delay-200 active:scale-90">See Detail</button>
                            <button onClick={() => handleBuy(animal)}  className="btn bg-emerald-500 hover:bg-emerald-700 hover:text-white transition-opacity delay-200 active:scale-90">Buy</button>
                        </div>
                    </div>
                </div>
            ))
        ) : (
            <div className="flex flex-col items-center">
                <img src='/cow-not-found.png' className=" w-[10rem] h-[10rem] " />
                <h2>Livestock Not Found</h2>
            </div>
        )}
        {showForm && selectedAnimal && (
            <>
                {/* Overlay blur */}
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={() => setShowForm(false)} />
                {/* Form */}
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
                    <FormBuyAnimal animal={selectedAnimal} hiddenForm={() => setShowForm(false)} />
                </div>
            </>
        )}
        {/* yg bawak mock semua */}
        </section>
    );
}