// app/livestock/page.tsx
import { fetchAllCategory, fetchAllLivestock } from "@/services/api";
import { CategoryDetailResponse, CustomApiError, LivestockAllResponse } from "@/types/interfaces";
import LivestockClient from "./livestockClient";
import { Suspense } from "react";


export const revalidate = 10;

export default async function LivestockPage() {
    const category: CategoryDetailResponse | CustomApiError = await fetchAllCategory();
    const livestocks: LivestockAllResponse | CustomApiError = await fetchAllLivestock();
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LivestockClient category={category} livestocks={livestocks} />
        </Suspense>
    )
}
