'use client'
import { Livestock } from "@/types/interfaces";
import { MessageSquareText } from "lucide-react";
import { useState } from "react";
import FormBuyAnimal from "./form-buy";
import SlideImageAnimal from "./slideImage-detail-livestock";

interface DescriptionAnimalProp {
    livestock: Livestock;
}
export default function ClientDescriptionAnimal ({ livestock }: DescriptionAnimalProp) {
    const [showForm, setShowForm] = useState<boolean>(false);

    const handleBtnBuy = (): void => {
        setShowForm(true);
    }
    return (
        <main className="flex flex-col items-center mt-[6rem] lg:mt-[12rem] gap-[2rem] text-black">
            {/* description section */}
            <section className="flex flex-col max-lg:items-center lg:flex-row gap-[2rem] xl:gap-[4rem] 2xl:gap-[6rem] w-[95vw] 2xl:w-[75vw] bg-amber-50 shadow-lg/30 ring-[0.1rem] ring-black/5 p-[2rem] rounded-[1rem]">
                {/* image */}
                <SlideImageAnimal images={livestock.img_livestock} />
                {/* description */}
                <div className="lg:w-[60%]">
                    <h3 className="font-bold max-lg:text-center">{livestock?.name}</h3>
                    <h4 className="mb-[2rem] max-lg:text-center">Category: {livestock?.category?.name}</h4>
                    <h5 className="text-justify">{livestock?.description}</h5>
                    <hr className="border-[0.15rem] my-[0.5rem]"></hr>
                    <h5>Farm: {livestock?.farm.name}</h5>
                    <h5>{livestock?.farm.location}</h5>
                    <hr className="border-[0.15rem] my-[0.5rem]"></hr>
                    <h5>Stock: {livestock?.stock} Heads</h5>
                    <div className="flex flex-row mt-[1rem] justify-center gap-[2rem]">
                        <button onClick={handleBtnBuy} className="font-bold btn w-[8rem] bg-emerald-500 hover:bg-emerald-700 hover:text-white xl:1rem text-[1.5rem] transition-opacity delay-200 active:scale-90">Buy</button>
                        <button className="bg-emerald-500 hover:bg-emerald-700 hover:text-white xl:1rem rounded-[0.5rem] transition-opacity delay-200 active:scale-90"><MessageSquareText className="w-[4rem]" /></button>
                    </div>
                </div>
            </section>
            {/* specification section */}
            <section className="w-[95vw] 2xl:w-[75vw] bg-amber-50 shadow-lg/30 ring-[0.1rem] ring-black/5 p-[2rem] px-[1.5rem] md:px-[3rem] xl:px-[8rem] rounded-[1rem] items-center">
                <h3 className="text-center mb-[2rem] font-bold">Spesification for {livestock?.name}</h3>
                <table className="min-w-full ">
                    <tbody className="bg-white/30">
                        {/* w-[88%] 2xl: */}
                        <tr className="border-t border-gray-500/15">
                            <td className="tds w-[75%] md:w-[85%] ">Age</td>
                            <td className="tds">{livestock?.age} Years</td>
                        </tr>
                        <tr className="border-t border-gray-500/15">
                            <td className="tds w-[75%] md:w-[85%] ">Category</td>
                            <td className="tds">{livestock?.category?.name}</td>
                        </tr>
                        <tr className="border-t border-gray-500/15">
                            <td className="tds w-[75%] md:w-[85%] ">Type</td>
                            <td className="tds">{livestock?.name}</td>
                        </tr>
                        <tr className="border-t border-gray-500/15">
                            <td className="tds w-[75%] md:w-[85%] ">Gender</td>
                            <td className="tds">Male</td>
                        </tr>
                    </tbody>
                </table>
            </section>
            {/* section form */}
            {showForm === true && (
            <>
                {/* Overlay blur */}
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={() => setShowForm(false)} />
                {/* Form */}
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
                    <FormBuyAnimal animal={livestock} hiddenForm={() => setShowForm(false)} />
                </div>
            </>
            )}
        </main>
    )
}