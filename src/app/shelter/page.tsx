import Navbar from "@/components/navbar";


export default function Shelter() {
    return(
        <div className="w-full flex flex-col items-center min-h-screen overflow-x-hidden">
            <Navbar/>
            <main className="flex items-center flex-col" >
            <h1 className="p-[8rem]">Hello Shelter</h1>
            </main>
        </div>
    )
}