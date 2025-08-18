import ClientDescriptionAnimal from "@/components/livestock/client-detail-livestock";
import FormBuyAnimal from "@/components/livestock/form-buy";
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
    const activeIconNav: string = 'animaldetail'; 
    return (
        <div className="w-full flex flex-col items-center min-h-screen overflow-x-hidden bg-amber-100">
            <Navbar activeIconNav={activeIconNav}/>
            <ClientDescriptionAnimal animal={animal} />
        </div>
    )
}