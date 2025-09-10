'use client'
import { Livestock } from "@/types/interfaces";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ReadonlyURLSearchParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import FormBuyAnimal from "./form-buy";
import { fetchAllLivestock } from "@/services/api";


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
    const [error, setError] = useState<string | null>(null);

    const handleBuy = (animal: Livestock) => {
        setSelectedAnimal(animal);
        setShowForm(true);
    };
    useEffect(() => {
        const fetchFiltered = async () => {
            const categoryIds = categoryParams.map(id => Number(id));
            const filteredRaw = await fetchAllLivestock(categoryIds, searchParams);
            if ('data' in filteredRaw) {
                setCurrentAnimal(filteredRaw.data);
            } else {
                setError(filteredRaw.error || filteredRaw.message);
            }
        };
        fetchFiltered();
    }, [findParams]);
    // console.log(animal)
    const handleRouter = (animalId: number) => {
        router.push(`/livestock/${animalId}`);
    }

    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <section className={`flex flex-row gap-[0.6rem] md:gap-[1rem] xl:gap-[2rem] flex-wrap w-full justify-center ${currentAnimal.length > 0 ? 'lg:justify-start' : 'justify-center min-h-[75vh]' } min-w-[71vw] xl:min-w-[77vw] 2xl:min-w-[70vw] items-center`}>
        {currentAnimal.length > 0 ? (
            currentAnimal.map((animal) => (
                <div key={animal.id} className="flex flex-col bg-[#FBF9E3] rounded-[1rem] w-[9rem] md:w-[14rem] xl:w-[20rem] shadow-lg/30 ring-[0.1rem] ring-black/5">
                    <img src={animal?.img_livestock[0]?.url} className="object-cover w-full rounded-t-[1rem] h-[8rem] md:h-[10rem] xl:h-[15rem]" alt={animal?.name} />
                    <div className="flex flex-col text-center px-[1rem]">
                        <h4 className="font-bold text-[#3F3916]">{animal?.name?.slice(0,14)}{animal?.name?.length > 15 ? '...' : ''}</h4>
                        <p className="pb-[0rem] md:pb-[1rem] text-[#3F3916]/60">Category: {animal?.category?.name}</p>
                        <div className="min-h-[4.5rem]">
                            <p className="text-justify hidden md:block text-[#3F3916]/60">{animal?.description.slice(0,78)}{animal?.description?.length > 78 ? '...' : ''}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-[1rem] px-[0.5rem] md:px-[1rem] pb-[0.5rem] md:pb-[1.5rem]">
                        <h5 className="font-bold text-[#3F3916]">Rp {animal?.price}</h5>
                        <div className="flex flex-row gap-[0.3rem] md:gap-[2rem] md:justify-between w-[100%]">
                            <button onClick={() => handleRouter(animal?.id)} className="btn bg-[#A09218] hover:bg-[#918300] hover:text-white xl:1rem transition-opacity delay-200 active:scale-90 font-bold shadow-lg/20 ring-[0.1rem] ring-black/5 text-[#F2FEDC]">See Detail</button>
                            <button onClick={() => handleBuy(animal)}  className="btn bg-[#976F52] hover:bg-[#a24d0f] hover:text-white transition-opacity delay-200 active:scale-90 font-bold shadow-lg/20 ring-[0.1rem] ring-black/5 text-[#F2FEDC]">Buy</button>
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