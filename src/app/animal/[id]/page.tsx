import Navbar from "@/components/navbar";
import { mockAnimals } from "@/services/api";
import { MessageSquareText } from "lucide-react";
export const revalidate = 300;

interface AnimalDetailParam {
    params: Promise <{ id: string }>
}
export const dynamic = 'force-dynamic';
export default async function AnimalDetailPage ({ params }: AnimalDetailParam) {
    const resolvedParams = await params;
    const id: number = parseInt(resolvedParams.id);
    const animal = await mockAnimals.find(anim => anim.id === id);
    return (
        <div className="w-full flex flex-col items-center min-h-screen overflow-x-hidden bg-amber-100">
            <Navbar />
            <main className="flex flex-col items-center mt-[6rem] lg:mt-[12rem] gap-[2rem] text-black">
                {/* description section */}
                <section className="flex flex-col max-lg:items-center lg:flex-row gap-[2rem] xl:gap-[4rem] 2xl:gap-[6rem] w-[95vw] 2xl:w-[75vw] bg-amber-50 shadow-lg/30 ring-[0.1rem] ring-black/5 p-[2rem] rounded-[1rem]">
                    {/* image */}
                    <div className="lg:w-[40%] flex items-center">
                        <img src={animal?.images?.[0]} className="w-[80rem] lg:h-[25rem] xl:h-[37rem] 2xl:h-[30rem] object-cover rounded-[1rem] border-[0.15rem] border-gray-800" />
                    </div>
                    {/* description */}
                    <div className="lg:w-[60%]">
                        <h3 className="font-bold max-lg:text-center">{animal?.type}</h3>
                        <h4 className="mb-[2rem] max-lg:text-center">Category: {animal?.category?.name}</h4>
                        <h5 className="text-justify">{animal?.description}</h5>
                        <hr className="border-[0.15rem] my-[0.5rem]"></hr>
                        <h5>Farm: {animal?.farm.name}</h5>
                        <h5>{animal?.farm.location}</h5>
                        <hr className="border-[0.15rem] my-[0.5rem]"></hr>
                        <h5>Stock: {animal?.stock} Heads</h5>
                        <div className="flex flex-row mt-[1rem] justify-center gap-[2rem]">
                            <button className="font-bold btn w-[8rem] bg-emerald-500 hover:bg-emerald-700 hover:text-white xl:1rem text-[1.5rem] transition-opacity delay-200 active:scale-90">Buy</button>
                            <button className="bg-emerald-500 hover:bg-emerald-700 hover:text-white xl:1rem rounded-[0.5rem] transition-opacity delay-200 active:scale-90"><MessageSquareText className="w-[4rem]" /></button>
                        </div>
                    </div>
                </section>
                {/* specification section */}
                <section className="w-[95vw] 2xl:w-[75vw] bg-amber-50 shadow-lg/30 ring-[0.1rem] ring-black/5 p-[2rem] px-[1.5rem] md:px-[3rem] xl:px-[8rem] rounded-[1rem] items-center">
                    <h3 className="text-center mb-[2rem] font-bold">Spesification for {animal?.type}</h3>
                    <table className="min-w-full ">
                        <tbody className="bg-white/30">
                            {/* w-[88%] 2xl: */}
                            <tr className="tds border-t border-gray-500/15">
                                <td className="w-[75%] md:w-[85%] lg:w-[90%] 2xl:w-[93%]">Age</td>
                                <td>{animal?.age} Years</td>
                            </tr>
                            <tr className="tds border-t border-gray-500/15">
                                <td className="w-[75%] md:w-[85%] lg:w-[90%] 2xl:w-[93%]">Category</td>
                                <td>{animal?.category?.name}</td>
                            </tr>
                            <tr className="tds border-t border-gray-500/15">
                                <td className="w-[75%] md:w-[85%] lg:w-[90%] 2xl:w-[93%]">Type</td>
                                <td>{animal?.type}</td>
                            </tr>
                            <tr className="tds border-t border-gray-500/15">
                                <td className="w-[75%] md:w-[85%] lg:w-[90%] 2xl:w-[93%]">Gender</td>
                                <td>Male</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
            </main>
        </div>
    )
}