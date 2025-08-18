'use client'
import { Livestock } from "@/types/interfaces"
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";

interface SlideImageAnimalProp {
    livestock: Livestock;
}
export default function SlideImageAnimal ({ livestock }: SlideImageAnimalProp) {
    const sliderRef = useRef<HTMLDivElement | null>(null);
    const [currentImageBig, setCurrentImageBig] = useState<string>(`${livestock?.img_livestock?.[0]}`)
    const handleSlider = (direction: string): void => {
        console.log(direction);
        const containerSlider = sliderRef.current;
        if(!containerSlider) return;
        const distanceScroll = 300;
        containerSlider.scrollBy(direction === "left" ? {left: -distanceScroll, behavior: "smooth"} : {left: distanceScroll, behavior: "smooth"});
    }
    const showImage = (image: string): void => {
        setCurrentImageBig(image);
    }
    return(
        <div className="flex flex-col lg:w-[40%] items-center gap-[1rem]">
            <img src={currentImageBig} className="w-[16rem] md:w-[80rem] h-[10rem] md:h-[25rem] xl:h-[30rem] 2xl:h-[30rem] object-cover rounded-[1rem] border-[0.15rem] border-gray-800" />
            <div className="w-[90%] flex items-center gap-2 justify-center">
                <button data-testid="arrow-left" onClick={() => handleSlider('left')} className="bg-yellow-300 h-6 rounded-[50%] shadow-lg hover:shadow-[0_0_4px_4px_rgba(240,183,140,0.6)] active:scale-80 duration-200"><ChevronLeft className="text-amber-700" /></button>
                <div ref={sliderRef} className="flex flex-row flex-nowrap gap-[0.5rem] lg:gap-[1rem] overflow-x-auto items-center overscroll-y-contain scrollbar-hide w-[80vw]">
                    {livestock?.img_livestock.map(image => (
                    <div className="relative flex flex-col items-start bg-cover bg-center rounded-2xl bg-black flex-shrink-0 justify-center p-[0.8rem] md:p-[2rem] pb-[4rem] w-[5rem] h-[5rem] lg:w-[5rem] lg:h-[5rem] ">
                        <button onClick={() => showImage(image.url)}><img alt={livestock?.name || 'Category image'} className="absolute inset-0 w-full h-full object-cover rounded-2xl opacity-40" src={image.url || "/no-img.jpg"} /></button>
                    </div>
                    ))}
                </div>
                <button onClick={() => handleSlider('right')} data-testid="arrow-right" className="bg-yellow-300 h-6 rounded-[50%] shadow-lg hover:shadow-[0_0_4px_4px_rgba(240,183,140,0.6)] active:scale-80 duration-200"><ChevronRight className="text-amber-700" /></button>
            </div>
        </div>
    )
}