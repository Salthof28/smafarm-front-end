import AnimalCardList from "@/components/animal/animal-card";
import Navbar from "@/components/navbar";
import { mockAnimals, mockCategory } from "@/services/api";
import { Animal, Category } from "@/types/interfaces";
import { Square, SquareCheckBig } from "lucide-react";


export default function AnimalPage() {
    const category: Category[] = mockCategory;
    const animals: Animal[] = mockAnimals;
    return(
        <div className="bg-amber-100 w-full flex flex-col items-center min-h-screen overflow-x-hidden">
            <Navbar/>
            <main className="flex items-center flex-col mt-[6rem] lg:mt-[12rem]" >
                {/* <h1 className="p-[8rem]">Hello Animal</h1> */}
                <section className="flex flex-row px-[0.5rem] md:px-[2vw] xl:px-[3vw] 2xl:px-[10vw] justify-center w-full">
                    <section className="hidden lg:block bg-amber-50 p-[2rem] shadow-lg/30 ring-[0.1rem] ring-black/5 min-w-[15rem] w-fit h-fit rounded-[0.5rem]">
                        <h4>Filter</h4>
                        <hr></hr>
                        <p className="font-bold">Category</p>
                        {category.map((cat) => 
                            <div className="flex flex-row gap-[0.2rem] items-center">
                                {/* <SquareCheckBig /> */}
                                <Square />
                                <p key={cat.id}>{cat.name}</p>
                            </div>
                        )}
                    </section>
                    <section className="flex flex-row gap-[0.6rem] md:gap-[1rem] xl:gap-[2rem] flex-wrap w-fit justify-center">
                        {animals.map((animal) => (
                            <AnimalCardList key={animal.id} animal={animal} />
                        ))}
                        {animals.map((animal) => (
                            <AnimalCardList key={animal.id} animal={animal} />
                        ))}
                        {animals.map((animal) => (
                            <AnimalCardList key={animal.id} animal={animal} />
                        ))}
                        {animals.map((animal) => (
                            <AnimalCardList key={animal.id} animal={animal} />
                        ))}
                        {animals.map((animal) => (
                            <AnimalCardList key={animal.id} animal={animal} />
                        ))}
                    </section>
                </section>
            </main>
        </div>
    )
}