import { Animal } from "@/types/interfaces";


interface AnimalCardListProp {
    animal: Animal;
}
export default function AnimalCardList ({ animal }: AnimalCardListProp) {
    return (
        <div className="flex flex-col bg-emerald-300 rounded-[1rem] w-[20rem]">
            <img src={animal?.images?.[0]} className="object-cover w-full rounded-t-[1rem] h-[15rem]" alt={animal?.type} />
            <div className="flex flex-col text-center px-[1rem]">
                <h4 className="font-extralight">{animal?.type?.slice(0,14)}{animal?.type?.length > 15 ? '...' : ''}</h4>
                <p className="pb-[1rem]">Category: {animal?.category?.name}</p>
                <p className="text-justify">{animal?.description.slice(0,78)}{animal?.description?.length > 78 ? '...' : ''}</p>
            </div>
            <div className="flex flex-col items-center gap-[1rem] px-[2rem] py-[1rem]">
                <p>Rp {animal?.price}</p>
                <div className="flex flex-row gap-[2rem] justify-between w-[100%]">
                    <button className="btn bg-emerald-400 shadow-lg/30">See Detail</button>
                    <button className="btn bg-emerald-400 shadow-lg/30">Buy</button>
                </div>
            </div>
        </div>
    );
}