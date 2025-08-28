'use client'
import AdminPanel from "@/components/dashboard/adminPanel";
import NavigationAdmin from "@/components/dashboard/navigation";
import { Plus, SquarePen } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
// import { useState } from "react";


export default function Dashboard () {
    const { data: session } = useSession();
    // const [products, setProducts] = useState<Product[]>([]);
    // const [category, setCategory] = useState<Category[]>([]);
    // const [loading, setLoading] = useState<boolean>(false);
    // const [error, setError] = useState<string>('');
    const headerTable: string[] = ['Name', 'Email', 'Status', 'Action'];
    // variabel paganation page
    // const [totalPoduct, setTotalProduct] = useState<number>(0);
    const [search, setSearch] = useState<string>();
    const [showForm, setShowForm] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const handleSearch = (e: React.FormEvent<HTMLFormElement>): void => {

    }

    const showFormUser = (): void => {

    }   
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
                    {/* title and btn add product section */}
                    <section className="flex flex-row justify-between w-full">
                        <h4 className="text-[1rem] md:text-[1.5rem] xl:text-[2rem] font-bold">Page Handle Users</h4>
                        <button onClick={() => showFormUser()} className="flex flex-row gap-[0.2rem] items-center text-[0.8rem] xl:text-[1rem] bg-emerald-500 p-[0.2rem] md:p-[0.4rem] rounded-[0.5rem]"><Plus className="w-[1rem] h-[1rem] xl:w-[1.2rem] xl:h-[1.2rem]" />Add User</button>
                    </section>
                    {/* form search */}
                    <form onSubmit={handleSearch} className="flex flex-row gap-[1rem] min-w-full items-center">
                        <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search" name="search" className="bg-[rgb(8,5,3)] rounded-[0.5rem] border border-gray-300/20 p-[0.3rem] text-[0.9rem] w-[100%]"/>
                        <button type="submit" className="bg-emerald-500 p-[0.4rem] rounded-[0.4rem] hover:bg-emerald-700 hover:text-white active:scale-95 duration-200 max-md:w-[6rem] text-[0.6rem] md:text-[0.8rem]">Search</button>
                    </form>
                    {/* tabel section */}
                    {(!showForm && !loading) && (
                    <section className="overflow-hidden rounded-[0.4rem] border border-gray-500/40 w-full">    
                        <table className="min-w-full">
                            <thead className="bg-indigo-400/10 ">
                                <tr>
                                {headerTable.map((header, index) => (
                                    <th key={index} className="px-[0.3rem] md:px-[0.8rem] xl:px-[2rem] py-[0.5rem] text-left text-[0.6rem] md:text-[0.8rem] xl:text-[1rem]">{header}</th>
                                ))}
                                </tr>
                            </thead>
                            <tbody className="bg-[#32190c6b] border-t border-gray-500/40">
                            {/* {users.map((user, index) => (
                                <tr key={index} className="border-t border-gray-500/40">
                                    <td className="flex flex-row items-center gap-[1rem] px-[0.3rem] md:px-[0.8rem] xl:px-[2rem] py-[0.5rem] text-left">
                                        <img src={user?.avatar} className="max-md:hidden w-[2rem] h-[2rem] xl:w-[2.8rem] xl:h-[2.8rem] rounded-[50%] object-cover border border-gray-500/40" />
                                        <p className="text-[0.6rem] md:text-[0.8rem] xl:text-[1rem] font-bold">{user?.name}</p>
                                    </td>
                                    <td className="text-[0.6rem] md:text-[0.8rem] xl:text-[1rem] px-[0.3rem] md:px-[0.8rem] xl:px-[2rem] py-[0.5rem] text-left font-bold">{user?.email}</td>
                                    <td className="text-[0.6rem] md:text-[0.8rem] xl:text-[1rem] px-[0.3rem] md:px-[0.8rem] xl:px-[2rem] py-[0.5rem] text-left font-bold">{user?.role}</td>
                                    <td className="text-[0.6rem] md:text-[0.8rem] xl:text-[1rem] items-center px-[0.3rem] md:px-[0.8rem] xl:px-[2rem] py-[0.5rem] text-left">
                                        <div className="flex flex-row gap-[1rem]">
                                            <button onClick={() => showFormProduct(user)} className="flex flex-row items-center gap-[0.1rem] md:gap-[0.4rem] text-blue-500 font-bold"><SquarePen className="w-[0.6rem] h-[0.6rem] md:w-[1.2rem] md:h-[1.2rem]" />Edit</button>
                                            <button onClick={() => handleDelete(user.id)} className="flex flex-row gap-[0.1rem] md:gap-[0.4rem] text-red-600 font-bold"><Trash2 className="w-[0.6rem] h-[0.6rem] md:w-[1.2rem] md:h-[1.2rem]" />Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))} */}
                            </tbody>
                        </table>
                    </section>
                    )}                  
              </section>
          </main>
      </div>
    )
}