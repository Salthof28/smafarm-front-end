import Navbar from "@/components/navbar";


export default function Cart() {
    const activeIconNav: string = 'cart'; 
    return(
        <div className="w-full flex flex-col items-center min-h-screen overflow-x-hidden">
            <Navbar activeIconNav={activeIconNav}/>
            <main className="flex items-center flex-col" >
            <h1 className="p-[8rem]">Hello Cart</h1>
            </main>
        </div>
    )
}