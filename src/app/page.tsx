import SlideImagesHome from "@/components/home/Slide-images-home";
import Navbar from "@/components/navbar";
import { fetchAllCategory } from "@/services/api";
import { CategoryDetailResponse, CustomApiError } from "@/types/interfaces";
import { Suspense } from "react";

export const revalidate = 10
export default async function Home() {
  const category: CategoryDetailResponse | CustomApiError = await fetchAllCategory(); 
  const activeIconNav: string = 'home'; 
  if ('statusCode' in category) {
    console.error("Error fetching category:", category.message);
    return (
      <div className="w-full flex flex-col items-center min-h-screen overflow-x-hidden">
        <Suspense fallback={<div>Loading...</div>}>
            <Navbar activeIconNav={activeIconNav} />
        </Suspense>
        <main className="flex items-center flex-col">
          <p className="text-red-500">Failed to load categories: {category.message}</p>
        </main>
      </div>
    );
  }
  const imageCategory: string[] = category.data.map(cat => cat.img_category);
  return (
    <div className="w-full flex flex-col items-center min-h-screen overflow-x-hidden">
      <Suspense fallback={<div>Loading...</div>}>
          <Navbar activeIconNav={activeIconNav} />
      </Suspense>
      <main className="flex items-center flex-col" >
        <SlideImagesHome imageCategory={imageCategory} />
      </main>
    </div>
  );
}
