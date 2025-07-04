import Navbar from "@/components/navbar";


export default function Cart() {
    const activeIconNav: string = 'cart'; 
    return(
        <div className="w-full bg-amber-100 flex flex-col items-center min-h-screen overflow-x-hidden">
            <Navbar activeIconNav={activeIconNav}/>
            <h2 className="pt-[8rem]">Checkout</h2>
            <main className="flex flex-col items-center gap-[2rem] text-black" >
                <div className="flex flex-col max-lg:items-center lg:flex-row gap-[2rem] xl:gap-[4rem] 2xl:gap-[6rem] w-[95vw] 2xl:w-[75vw] bg-amber-50 shadow-lg/30 ring-[0.1rem] ring-black/5 p-[2rem] rounded-[1rem] justify-center">
                    <h4>Your cart is empty. Let's fill it up with something awesome!</h4>
                </div>
            </main>
        </div>
    )
}