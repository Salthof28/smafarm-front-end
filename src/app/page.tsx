import SlideImagesHome from "@/components/home/Slide-images-home";
import Navbar from "@/components/navbar";
import { mockCategory } from "@/services/api";
import { Category } from "@/types/interfaces";

export const revalidate = 10
export default async function Home() {
  const category: Category[] = await mockCategory; 
  const imageCategory: string[] = category.map(cat => cat.img_category);
  const activeIconNav: string = 'home'; 
  return (
    <div className="w-full flex flex-col items-center min-h-screen overflow-x-hidden">
      <Navbar activeIconNav={activeIconNav}/>
      <main className="flex items-center flex-col" >
        <SlideImagesHome imageCategory={imageCategory} />
      </main>
    </div>
  );
}
