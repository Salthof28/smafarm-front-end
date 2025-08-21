'use client'
import { Shelter } from "@/types/interfaces";
import { MessageSquareText } from "lucide-react";
import { useState } from "react";
import SlideImageAnimal from "../livestock/slideImage-detail-livestock";
import FormRentShelter from "./form-care";

interface DescriptionAnimalProp {
    shelter: Shelter;
}
export default function ClientDescriptionShelter ({ shelter }: DescriptionAnimalProp) {
    const [showForm, setShowForm] = useState<boolean>(false);
    const requiredCares = shelter.care_give.filter(care => care.required);
    const optionalCares = shelter.care_give.filter(care => !care.required);

    const handleBtnBuy = (): void => {
        setShowForm(true);
    }
    return (
        <main className="flex flex-col items-center mt-[6rem] lg:mt-[12rem] gap-[2rem] text-black">
            {/* description section */}
            <section className="flex flex-col max-lg:items-center lg:flex-row gap-[2rem] xl:gap-[4rem] 2xl:gap-[6rem] w-[95vw] 2xl:w-[75vw] bg-amber-50 shadow-lg/30 ring-[0.1rem] ring-black/5 p-[2rem] rounded-[1rem]">
                {/* image */}
                <SlideImageAnimal images={shelter.img_shelter} />
                {/* description */}
                <div className="lg:w-[60%]">
                    <h3 className="font-bold max-lg:text-center">{shelter?.name}</h3>
                    <h4 className="mb-[2rem] max-lg:text-center">Category: {shelter?.category?.name}</h4>
                    <h5 className="text-justify">{shelter?.description}</h5>
                    <hr className="border-[0.15rem] my-[0.5rem]"></hr>
                    <h5>Farm: {shelter?.farm.name}</h5>
                    <h5>{shelter?.farm.location}</h5>
                    <hr className="border-[0.15rem] my-[0.5rem]"></hr>
                    <h5>Accomodate: {shelter?.accomodate} Heads</h5>
                    <div className="flex flex-row mt-[1rem] justify-center gap-[2rem]">
                        <button onClick={handleBtnBuy} className="font-bold btn w-[8rem] bg-emerald-500 hover:bg-emerald-700 hover:text-white xl:1rem text-[1.5rem] transition-opacity delay-200 active:scale-90">Rent</button>
                        <button className="bg-emerald-500 hover:bg-emerald-700 hover:text-white xl:1rem rounded-[0.5rem] transition-opacity delay-200 active:scale-90"><MessageSquareText className="w-[4rem]" /></button>
                    </div>
                </div>
            </section>
            {/* specification section */}
            <section className="w-[95vw] 2xl:w-[75vw] bg-amber-50 shadow-lg/30 ring-[0.1rem] ring-black/5 p-[2rem] px-[1.5rem] md:px-[3rem] xl:px-[8rem] rounded-[1rem] items-center">
                <h3 className="text-center mb-[2rem] font-bold">Spesification for {shelter?.name}</h3>
                <table className="min-w-full ">
                    <tbody className="bg-white/30">
                        {/* w-[88%] 2xl: */}
                        <tr className="tds border-t border-gray-500/15">
                            <td className="w-[68%] md:w-[80%] lg:w-[85%] 2xl:w-[88%]">Accomodate</td>
                            <td>{shelter?.accomodate} Heads</td>
                        </tr>
                        <tr className="tds border-t border-gray-500/15">
                            <td className="w-[68%] md:w-[80%] lg:w-[85%] 2xl:w-[88%]">Category</td>
                            <td>{shelter?.category?.name}</td>
                        </tr>
                        <tr className="tds border-t border-gray-500/15">
                            <td className="w-[68%] md:w-[80%] lg:w-[85%] 2xl:w-[88%]">Care Required:</td>
                        </tr>
                        {requiredCares.map((required) => (                      
                            <tr key={required.id} className="tds border-t border-gray-500/15">
                                <td className="w-[68%] md:w-[80%] lg:w-[85%] 2xl:w-[88%]">{required.name}</td>
                                <td>Rp {required.price} / {required.unit}</td>
                            </tr>
                        ))}
                        <tr className="tds border-t border-gray-500/15">
                            <td className="w-[68%] md:w-[80%] lg:w-[85%] 2xl:w-[88%]">Care Optional:</td>
                        </tr>
                        {optionalCares.map((optional) => (                      
                            <tr key={optional.id} className="tds border-t border-gray-500/15">
                                <td className="w-[68%] md:w-[80%] lg:w-[85%] 2xl:w-[88%]">{optional.name}</td>
                                <td>Rp {optional.price} / {optional.unit}</td>
                            </tr>
                        ))}
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
                    <FormRentShelter shelter={shelter} hiddenForm={() => setShowForm(false)} />
                </div>
            </>
            )}
        </main>
    )
}