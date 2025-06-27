import Navbar from "@/components/navbar";


export default function Login() {
    return(
        <div className="w-full flex flex-col items-center min-h-screen overflow-x-hidden">
            <Navbar/>
            <main className="flex items-center flex-col" >
            <h1 className="p-[8rem]">Hello Login</h1>
            </main>
        </div>
    )
}