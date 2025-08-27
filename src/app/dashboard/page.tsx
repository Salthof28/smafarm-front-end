'use client'
import AdminPanel from "@/components/dashboard/adminPanel";
import NavigationAdmin from "@/components/dashboard/navigation";
import { useSession } from "next-auth/react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
// import { useState } from "react";


export default function Dashboard () {
    const { data: session } = useSession();
    // const [products, setProducts] = useState<Product[]>([]);
    // const [category, setCategory] = useState<Category[]>([]);
    // const [loading, setLoading] = useState<boolean>(false);
    // const [error, setError] = useState<string>('');

    // variabel paganation page
    // const [totalPoduct, setTotalProduct] = useState<number>(0);
    
    const data = [
        { name: 'Jan', sales: 400, orders: 120 },
        { name: 'Feb', sales: 300, orders: 90 },
        { name: 'Mar', sales: 500, orders: 150 },
        { name: 'Apr', sales: 200, orders: 60 },
    ];

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
                      <section className="flex flex-col gap-[1rem] p-[1rem] overflow-hidden rounded-[0.4rem] border border-gray-500/40 w-full h-64 md:h-80 lg:h-96">    
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" /> {/* Grid background */}
                            <XAxis dataKey="name" /> {/* Label bulan di X-axis */}
                            <YAxis /> {/* Skala angka di Y-axis */}
                            <Tooltip /> {/* Tooltip interaktif */}
                            <Legend /> {/* Legend di atas chart */}
                            <Line
                                type="monotone" // bikin garis halus
                                dataKey="sales"
                                stroke="#8884d8"
                                strokeWidth={2}
                                dot={{ r: 5 }} // titik di setiap data
                                activeDot={{ r: 8 }} // titik besar saat hover
                            />
                            </LineChart>
                        </ResponsiveContainer>
                      </section>
                  </section>
                  {/* {loading && (
                  <section className="flex justify-center items-center w-full h-full">
                      <h1 className="text-lg lg:text-xl xl:text-2xl 2xl:text-4xl font-bold text-amber-50">Loading....</h1>
                  </section>
                  )} */}
              </section>
          </main>
      </div>
    )
}