// 'use client'
// import useAuth from "@/hooks/useAuth";
// import { fetchLogout } from "@/services/api";
// import { signOut } from "next-auth/react";


// export default function Dashboard () {
//     const { session } = useAuth()
//     const logOut = async (): Promise<void> => {
//         if (!session?.refreshToken) {
//             console.error("No access token found");
//             return;
//         };
//         await fetchLogout(session?.refreshToken);      
//         signOut({callbackUrl: "/login"});
//     }
//     return(
//         <div>
//             <h1>hai {session?.user.name}: {session?.user.role}</h1>
//             <button onClick={logOut} className="bg-emerald-500 p-[0.3rem] xl:p-[0.5rem] rounded-[0.4rem] text-[0.8rem] xl:text-[1rem]">Sign Out</button>
//         </div>
//     )
// }
'use client'
import AdminPanel from "@/components/dashboard/adminPanel";
import NavigationAdmin from "@/components/dashboard/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";


export default function Dashboard () {
    const { data: session } = useSession();
    // const [products, setProducts] = useState<Product[]>([]);
    // const [category, setCategory] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    // const [error, setError] = useState<string>('');

    // variabel paganation page
    const [totalPoduct, setTotalProduct] = useState<number>(0);
    
  

    // console.log(totalProductbyCat());
    return (
      <div className="bg-[rgb(8,5,3)] min-h-screen overflow-x-hidden">
          <NavigationAdmin session={session} />
          <main className="flex flex-row text-[rgb(240,230,226)] min-h-screen">
            {/* for panel */}
            <section className="lg:w-[15%]">
                <AdminPanel session={session} />
            </section>
              {/* for content */}
              <section className="flex flex-col w-[100%] lg:w-[85%] p-[2rem] text-[rgb(240,230,226)] items-center px-[0.5rem] md:px-[10rem] xl:px-[20rem] 2xl:px-[40rem] gap-[1rem]">
                  <h3 className="text-[1rem] md:text-[1.5rem] xl:text-[2rem] font-bold">Dashboard</h3>
                  {/* section persentase product */}
                  <section className="flex flex-row min-w-full gap-[1rem]">
                      {/* card 1 */}
                      <section className="flex flex-col gap-[1rem] p-[1rem] overflow-hidden rounded-[0.4rem] border border-gray-500/40 w-full">    
  
                      </section>
                  </section>
                  {loading && (
                  <section className="flex justify-center items-center w-full h-full">
                      <h1 className="text-lg lg:text-xl xl:text-2xl 2xl:text-4xl font-bold text-amber-50">Loading....</h1>
                  </section>
                  )}
              </section>
          </main>
      </div>
    )
}