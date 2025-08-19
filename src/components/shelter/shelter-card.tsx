'use client'
import { fetchAllShelter } from "@/services/api";
import { Shelter } from "@/types/interfaces";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ReadonlyURLSearchParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import FormRentShelter from "./form-care";

interface AnimalCardListProp {
    shelters: Shelter[];
}
export default function ShelterCardList ({ shelters }: AnimalCardListProp) {
    const router: AppRouterInstance = useRouter();
    const findParams: ReadonlyURLSearchParams = useSearchParams();
    const categoryParams = findParams.getAll('category') || [];
    const searchParams = findParams.get('search') || "";
    const [currentShelter, setCurrentShelter] = useState<Shelter[]>(shelters);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [selectedShelter, setSelectedShelter] = useState<Shelter | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleBuy = (shelter: Shelter) => {
        setSelectedShelter(shelter);
        setShowForm(true);
    };
    useEffect(() => {
        const fetchFiltered = async () => {
            const categoryIds = categoryParams.map(id => Number(id));
            const filteredRaw = await fetchAllShelter(categoryIds, searchParams);
            if ('data' in filteredRaw) {
                setCurrentShelter(filteredRaw.data);
            } else {
                setError(filteredRaw.error || filteredRaw.message);
            }
        };
        fetchFiltered();
    }, [findParams]);
    // console.log(animal)
    const handleRouter = (shelterlId: number) => {
        router.push(`/shelter/${shelterlId}`);
    }

    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <section className={`flex flex-row gap-[0.6rem] md:gap-[1rem] xl:gap-[2rem] flex-wrap w-full justify-center ${currentShelter.length > 0 ? 'lg:justify-start' : 'justify-center min-h-[75vh]' } min-w-[71vw] xl:min-w-[77vw] 2xl:min-w-[70vw] items-center`}>
        {currentShelter.length > 0 ? (
            currentShelter.map((shelter) => (
                <div className="flex flex-col bg-amber-50 rounded-[1rem] w-[9rem] md:w-[14rem] xl:w-[20rem] shadow-lg/30 ring-[0.1rem] ring-black/5">
                    <img src={shelter?.img_shelter[0]?.url} className="object-cover w-full rounded-t-[1rem] h-[8rem] md:h-[10rem] xl:h-[15rem]" alt={shelter?.name} />
                    <div className="flex flex-col text-center px-[1rem]">
                        <h4 className="font-extralight">{shelter?.name?.slice(0,14)}{shelter?.name?.length > 15 ? '...' : ''}</h4>
                        <p className="pb-[0rem] md:pb-[1rem]">Category: {shelter?.category?.name}</p>
                        <p className="text-justify hidden md:block">{shelter?.description.slice(0,78)}{shelter?.description?.length > 78 ? '...' : ''}</p>
                    </div>
                    <div className="flex flex-col items-center gap-[1rem] px-[0.5rem] md:px-[1rem] xl:px-[2rem] py-[0.5rem] md:py-[1rem]">
                        <p className="font-bold">Rp {shelter?.price_daily}/day</p>
                        <div className="flex flex-row gap-[0.3rem] md:gap-[2rem] md:justify-between w-[100%]">
                            <button onClick={() => handleRouter(shelter?.id)} className="btn bg-emerald-500 hover:bg-emerald-700 hover:text-white xl:1rem transition-opacity delay-200 active:scale-90">See Detail</button>
                            <button onClick={() => handleBuy(shelter)}  className="btn bg-emerald-500 hover:bg-emerald-700 hover:text-white transition-opacity delay-200 active:scale-90">Buy</button>
                        </div>
                    </div>
                </div>
            ))
        ) : (
            <div className="flex flex-col items-center">
                <img src='/shelter-not-found.png' className=" w-[10rem] h-[10rem] " />
                <h2>Shelter Not Found</h2>
            </div>
        )}
        {showForm && selectedShelter && (
            <>
                {/* Overlay blur */}
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={() => setShowForm(false)} />
                {/* Form */}
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
                    <FormRentShelter shelter={selectedShelter} hiddenForm={() => setShowForm(false)} />
                </div>
            </>
        )}
        {/* yg bawak mock semua */}
        </section>
    );
}