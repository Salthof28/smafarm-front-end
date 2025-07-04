import Navbar from "@/components/navbar";


export default function Login() {
    const activeIconNav: string = 'login'; 
    return(
        <div className="bg-amber-100 w-full flex flex-col items-center min-h-screen overflow-x-hidden">
            <Navbar activeIconNav={activeIconNav}/>
            <main className="flex items-center flex-col justify-center min-h-[100vh]">
                <form className="flex flex-col bg-amber-50 shadow-lg/30 ring-[0.1rem] ring-black/5 p-[2rem] gap-[1rem] rounded-[1rem] w-[15rem] lg:w-[25rem] text-black">
                    <h4 className="font-extrabold text-[1rem] lg:text-[2.5rem]">Login Page</h4>
                    <input data-testid="inptEmail" type="email" placeholder="email@mail.com" className="border p-[0.2rem] lg:p-[0.5rem] rounded-[0.6rem] text-[1rem] lg:text-[1.5rem]" />
                    <input data-testid="inptPassword" type="password" placeholder="Passsword" className="border p-[0.2rem] lg:p-[0.5rem] rounded-[0.6rem] text-[1rem] lg:text-[1.5rem]" />
                    <button data-testid="btnSignIn" type="submit" className="bg-emerald-500 rounded-[0.6rem] hover:bg-emerald-700 hover:text-white active:scale-95 duration-200 text-[1rem] lg:text-[1.5rem] p-[0.2rem] lg:p-[0.5rem]">Sign In</button>
                    <button data-testid="btnCreate" type="button" className="bg-emerald-500 rounded-[0.6rem] hover:bg-emerald-700 hover:text-white active:scale-95 duration-200 text-[1rem] lg:text-[1.5rem] p-[0.2rem] lg:p-[0.5rem]" >Create Account</button>
                </form>
            </main>
        </div>
    )
}