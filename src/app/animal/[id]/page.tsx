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
        <div className="w-full flex flex-col items-center min-h-screen overflow-x-hidden">
            <Navbar />
            <main className="flex flex-col items-center mt-[12rem] gap-[2rem]">
                {/* description section */}
                <section className="flex flex-row gap-[6rem] w-[75vw] bg-emerald-400 p-[2rem] rounded-[1rem]">
                    {/* image */}
                    <div className="w-[40%]">
                        <img src={animal?.images?.[0]} className="w-[80rem] h-[30rem] object-cover rounded-[1rem] border-[0.15rem] border-gray-800" />
                    </div>
                    {/* description */}
                    <div className="w-[60%]">
                        <h3 className="font-bold">{animal?.type}</h3>
                        <h4 className="mb-[2rem]">Category: {animal?.category?.name}</h4>
                        <h5 className="text-justify">{animal?.description}</h5>
                        <hr className="border-[0.15rem]"></hr>
                        <h4>Farm: Joko Farm</h4>
                        <h4>Stock: 10 Unit</h4>
                        <hr className="border-[0.15rem]"></hr>
                        <div className="flex flex-row mt-[1rem] justify-center gap-[2rem]">
                            <button className="btn w-[8rem] bg-blue-400 text-[1.5rem]">Buy</button>
                            <button className="bg-blue-400 rounded-[0.5rem]"><MessageSquareText className="w-[4rem]" /></button>
                        </div>
                    </div>
                </section>
                {/* specification section */}
                <section className="w-[75vw] bg-emerald-400 p-[2rem] px-[8rem] rounded-[1rem] items-center">
                    <h3 className="text-center mb-[2rem] font-bold">Spesification for {animal?.type}</h3>
                    <table className="min-w-full">
                        <tr className="text-[1.5rem]">
                            <td className="w-[90%]">Age</td>
                            <td>{animal?.age} Years</td>
                        </tr>
                        <tr className="text-[1.5rem]">
                            <td className="w-[90%]">Category</td>
                            <td>{animal?.category?.name}</td>
                        </tr>
                        <tr className="text-[1.5rem]">
                            <td className="w-[90%]">Type</td>
                            <td>{animal?.type}</td>
                        </tr>
                        <tr className="text-[1.5rem]">
                            <td className="w-[90%]">Gender</td>
                            <td>Male</td>
                        </tr>
                        {/* <tr className="text-[1.5rem]">
                            <td className="w-[90%]">Age</td>
                            <td>{animal?.age} Years</td>
                        </tr> */}
                    </table>
                </section>
            </main>
        </div>
    )
}