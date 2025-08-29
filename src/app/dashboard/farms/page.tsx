'use client'
import AdminPanel from "@/components/dashboard/adminPanel";
import FormFarmAdmin from "@/components/dashboard/form-farm-admin";
import NavigationAdmin from "@/components/dashboard/navigation";
import { fetchAllFarms } from "@/services/api";
import { Farm } from "@/types/interfaces";
import { message } from "antd";
import { SquarePen } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";


export default function DashboardFarms () {
    const { data: session } = useSession();
    const [farms, setFarms] = useState<Farm[]>([]);
    const [currentFarm, setCurrentFarm] = useState<Farm | undefined>(undefined);
    const [messageApi, contextHolder] = message.useMessage();
    const [search, setSearch] = useState<string>()
    const [showForm, setShowForm] = useState<boolean>(false);
    const headerTable: string[] = ['Name', 'Location', 'Status', 'Action'];
    
    const fetchFarms = async (searchName?: string) => {
        const farmJson = await fetchAllFarms(searchName);
        if ('data' in farmJson) {
            setFarms(farmJson.data);
        } else {
            console.error('Error fetching shelters:', farmJson.message);
            messageApi.open({
                type: 'error',
                content: farmJson.message,
            });
        }
    }
    useEffect (() => {
        fetchFarms();
    }, []);

    const handleShowForm = (oneFarm: Farm) => {
        setCurrentFarm(oneFarm);
        setShowForm(true)
    }

    const handleSearch = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        fetchFarms(search);
    }

    return (
      <div className="bg-[rgb(8,5,3)] min-h-screen overflow-x-hidden">
          <NavigationAdmin session={session} />
          <main className="flex flex-row text-[rgb(240,230,226)] min-h-screen">
            {/* for panel */}
            <section className="lg:w-[15%]">
                <AdminPanel session={session} />
            </section>
              {/* for content */}
              <section className="flex flex-col w-[100%] lg:w-[85%] p-[2rem] text-[rgb(240,230,226)] items-center px-[0.5rem] md:px-[10rem] xl:px-[4rem] 2xl:px-[20rem] gap-[1rem]">
                {contextHolder}
                    <section className="flex flex-row justify-between w-full">
                        <h4 className="text-[1rem] md:text-[1.5rem] xl:text-[2rem] font-bold">Page Handle Farms</h4>
                    </section>
                    {/* form search */}
                    <form onSubmit={handleSearch} className="flex flex-row gap-[1rem] min-w-full items-center">
                        <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search" name="search" className="bg-[rgb(8,5,3)] rounded-[0.5rem] border border-gray-300/20 p-[0.3rem] text-[0.9rem] w-[100%]"/>
                        <button type="submit" className="bg-emerald-500 p-[0.4rem] rounded-[0.4rem] hover:bg-emerald-700 hover:text-white active:scale-95 duration-200 max-md:w-[6rem] text-[0.6rem] md:text-[0.8rem]">Search</button>
                    </form>
                    {/* tabel section */}
                    {(!showForm) && (
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
                            {farms.map((farm) => (
                                <tr key={farm.id} className="border-t border-gray-500/40">
                                    <td className="text-[0.6rem] md:text-[0.8rem] xl:text-[1rem] px-[0.3rem] md:px-[0.8rem] xl:px-[2rem] py-[0.5rem] text-left">{farm?.name}</td>
                                    <td className="text-[0.6rem] md:text-[0.8rem] xl:text-[1rem] px-[0.3rem] md:px-[0.8rem] xl:px-[2rem] py-[0.5rem] text-left font-bold">{farm?.location.slice(0,45)}{farm?.location?.length > 45 ? '...' : ''}</td>
                                    <td className="text-[0.6rem] md:text-[0.8rem] xl:text-[1rem] px-[0.3rem] md:px-[0.8rem] xl:px-[2rem] py-[0.5rem] text-left font-bold">{farm?.status_farm}</td>
                                    <td className="text-[0.6rem] md:text-[0.8rem] xl:text-[1rem] items-center px-[0.3rem] md:px-[0.8rem] xl:px-[2rem] py-[0.5rem] text-left">
                                        <div className="flex flex-row gap-[1rem]">
                                            <button onClick={() => handleShowForm(farm)} className="flex flex-row items-center gap-[0.1rem] md:gap-[0.4rem] text-blue-500 font-bold"><SquarePen className="w-[0.6rem] h-[0.6rem] md:w-[1.2rem] md:h-[1.2rem]"/>Edit</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        {/* web page */}
                    </section>
                    )}
                    {/* show form detail farm */}
                    {showForm === true && currentFarm && (
                    <>
                        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={() => setShowForm(false)} />
                        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
                            <FormFarmAdmin hiddenForm={() => setShowForm(false)} currentFarm={currentFarm} fetchFarms={fetchFarms} />
                        </div>
                    </>
                    )}
              </section>
          </main>
      </div>
    )
}