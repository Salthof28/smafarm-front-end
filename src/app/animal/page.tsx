import AnimalCardList from "@/components/animal/animal-card";
import Navbar from "@/components/navbar";
import { mockAnimals, mockCategory } from "@/services/api";
import { Animal, Category } from "@/types/interfaces";


export default function AnimalPage() {
    const category: Category[] = mockCategory;
    const animals: Animal[] = mockAnimals;
    return(
        <div className="w-full flex flex-col items-center min-h-screen overflow-x-hidden">
            <Navbar/>
            <main className="flex items-center flex-col mt-[12rem]" >
                {/* <h1 className="p-[8rem]">Hello Animal</h1> */}
                <section className="flex flex-row px-[10vw] justify-center w-full">
                    <section className="bg-white p-[2rem] shadow-lg/30 ring-[0.1rem] ring-black/5 min-w-[15rem] w-fit h-fit rounded-[0.5rem]">
                        <h4>Filter</h4>
                        <hr></hr>
                        <p>Category</p>
                        {category.map((cat) => 
                            <p key={cat.id}>{cat.name}</p>
                        )}
                    </section>
                    <section className="flex flex-row gap-[2rem] flex-wrap w-fit justify-center">
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