'use client'
import { Category } from "@/types/interfaces";
import { Square, SquareCheckBig } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ReadonlyURLSearchParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

interface FilterCardProp {
    category: Category;
    activeIconNav: string;
}
export default function FilterCard ({ category, activeIconNav }: FilterCardProp) {
    const router: AppRouterInstance = useRouter();
    const searchParams: ReadonlyURLSearchParams = useSearchParams();
    const categoryParams = searchParams.getAll('category').map(Number) || 'All';
    const [checklist, setChecklist] = useState<boolean>(categoryParams.includes(category.id));
    
    const handleChecklist = (): void => {
        const collectCatParams = checklist ? categoryParams.filter((cat) => cat !== category.id) : [...categoryParams, category.id];
        setChecklist(!checklist);
        // console.log(collectCatParams)
        updateParams(collectCatParams)
    } 
    const updateParams = useCallback((catParams: number[]) => {
        const params = new URLSearchParams(searchParams.toString());
        // delete old params
        params.delete('category');
        // add new params
        catParams.forEach((cat) => params.append('category', `${cat}`));
        if(activeIconNav === 'animal'){
            router.push(`/livestock?${params.toString()}`);
        } 
        else  {
            router.push(`/shelter?${params.toString()}`);
        }
        router.refresh();
    }, [searchParams])
    

    return (
        <button onClick={handleChecklist} className="flex flex-row gap-[0.2rem] items-center">
            {checklist === true ? (<SquareCheckBig className="stroke-green-600" />) : (<Square />)}
            <p key={category.id}>{category.name}</p>
        </button>
    )
}