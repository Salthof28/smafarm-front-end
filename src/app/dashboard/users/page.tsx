'use client'
import AdminPanel from "@/components/dashboard/adminPanel";
import FormUserAdmin from "@/components/dashboard/form-user-admin";
import NavigationAdmin from "@/components/dashboard/navigation";
import RegisterByAdmin from "@/components/dashboard/register-by-admin";
import { fetchAllUsers } from "@/services/api";
import { UserOut } from "@/types/interfaces";
import { message } from "antd";
import { Plus, SquarePen, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
// import { useState } from "react";


export default function Dashboard () {
    const { data: session } = useSession();
    const [users, setUsers] = useState<UserOut[]>([]);
    const [currentUser, setCurrentUser] = useState<UserOut | undefined>(undefined);
    const headerTable: string[] = ['Name', 'Status', 'Role', 'Action'];
    const [messageApi, contextHolder] = message.useMessage();
    const [search, setSearch] = useState<string>();
    const [showForm, setShowForm] = useState<boolean>(false);
    const token  = session?.accessToken;

    const fetchUsers = async (searchName?: string) => {
        if (!token) {
            return;
        }
        const userJson = await fetchAllUsers (token, searchName);
        if ('data' in userJson) {
            setUsers(userJson.data);
        } else {
            console.error('Error fetching shelters:', userJson.message);
            messageApi.open({
                type: 'error',
                content: userJson.message,
            });
        }
    }

    useEffect (() => {
        fetchUsers();
    }, [session]);


    const handleSearch = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        fetchUsers(search);
    }

    const showFormUser = (user?: UserOut): void => {
        if (user) {
            setCurrentUser(user);
        }
        else{
            setCurrentUser(undefined);
        }
        setShowForm(true);
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
                <section className="flex flex-col w-[100%] lg:w-[85%] p-[2rem] text-[rgb(240,230,226)] items-center px-[0.5rem] md:px-[10rem] xl:px-[4rem] 2xl:px-[20rem] gap-[1rem]">
                    {contextHolder}
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
                            {users.map((user, index) => (
                                <tr key={index} className="border-t border-gray-500/40">
                                    <td className="flex flex-row items-center gap-[1rem] px-[0.3rem] md:px-[0.8rem] xl:px-[2rem] py-[0.5rem] text-left">
                                        <img src={user?.img_profile} className="max-md:hidden w-[2rem] h-[2rem] xl:w-[2.8rem] xl:h-[2.8rem] rounded-[50%] object-cover border border-gray-500/40" />
                                        <div>
                                            <p className="text-[0.6rem] md:text-[0.8rem] xl:text-[1rem] font-bold">{user?.name}</p>
                                            <span className="max-md:hidden md:text-[0.6rem]">{user?.email}</span>
                                        </div>
                                    </td>
                                    <td className="text-[0.6rem] md:text-[0.8rem] xl:text-[1rem] px-[0.3rem] md:px-[0.8rem] xl:px-[2rem] py-[0.5rem] text-left font-bold">{user?.status}</td>
                                    <td className="text-[0.6rem] md:text-[0.8rem] xl:text-[1rem] px-[0.3rem] md:px-[0.8rem] xl:px-[2rem] py-[0.5rem] text-left font-bold">{user?.role}</td>
                                    <td className="text-[0.6rem] md:text-[0.8rem] xl:text-[1rem] items-center px-[0.3rem] md:px-[0.8rem] xl:px-[2rem] py-[0.5rem] text-left">
                                        <div className="flex flex-row gap-[1rem]">
                                            <button onClick={() => showFormUser(user)} className="flex flex-row items-center gap-[0.1rem] md:gap-[0.4rem] text-blue-500 font-bold"><SquarePen className="w-[0.6rem] h-[0.6rem] md:w-[1.2rem] md:h-[1.2rem]" />Edit</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </section>
                    )}
                    {showForm === true && currentUser && (
                    <>
                        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={() => setShowForm(false)} />
                        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
                            <FormUserAdmin hiddenForm={() => setShowForm(false)} currentUser={currentUser} fetchUsers={fetchUsers}/> 
                        </div>
                    </>
                    )}   

                    {showForm === true && !currentUser && (
                    <>
                        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={() => setShowForm(false)} />
                        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
                            <RegisterByAdmin hiddenForm={() => setShowForm(false)} /> 
                        </div>
                    </>
                    )}                 
              </section>
          </main>
      </div>
    )
}