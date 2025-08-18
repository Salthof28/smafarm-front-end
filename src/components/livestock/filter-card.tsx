'use client'
import { Animal, Category, CustomApiError } from "@/types/interfaces";
import { Square, SquareCheckBig } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ReadonlyURLSearchParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

interface FilterCardProp {
    category: Category;
}
export default function FilterCard ({ category }: FilterCardProp) {
    const router: AppRouterInstance = useRouter();
    const searchParams: ReadonlyURLSearchParams = useSearchParams();
    const categoryParams = searchParams.getAll('category') || 'All';
    const [checklist, setChecklist] = useState<boolean>(categoryParams.includes(category.name));
    
    const handleChecklist = (): void => {
        const collectCatParams = checklist ? categoryParams.filter((cat) => cat !== category.name) : [...categoryParams, category.name];
        setChecklist(!checklist);
        // console.log(collectCatParams)
        updateParams(collectCatParams)
    } 
    const updateParams = useCallback((catParams: string[]) => {
        const params = new URLSearchParams(searchParams.toString());
        // delete old params
        params.delete('category');
        // add new params
        catParams.forEach((cat) => params.append('category', cat));
        router.push(`/livestock?${params.toString()}`);
        router.refresh();
    }, [searchParams])
    

    return (
        <button onClick={handleChecklist} className="flex flex-row gap-[0.2rem] items-center">
            {checklist === true ? (<SquareCheckBig className="stroke-green-600" />) : (<Square />)}
            <p key={category.id}>{category.name}</p>
        </button>
    )
}