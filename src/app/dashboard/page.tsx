'use client'
import AdminPanel from "@/components/dashboard/adminPanel";
import NavigationAdmin from "@/components/dashboard/navigation";
import { fetchAllTransactionByAdmin } from "@/services/api";
import { Transaction } from "@/types/interfaces";
import { message } from "antd";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type ChartData = {
    name: string;
    sales: number;
};
export default function Dashboard () {
    const { data: session } = useSession();
    const token = session?.accessToken;
    // const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [chartData, setChartData] = useState<{
        sellLivestock: ChartData[],
        shelterCare: ChartData[] 
    }>({
        sellLivestock: [],
        shelterCare: []
    });
    const formatNumber = (value: number) => {
        if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1) + "B";
        if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
        if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
        return value.toString();
    };
    useEffect(() => {
        if (token) {
        fetchAlltransaction();
        }
    }, [token]);

    const fetchAlltransaction = async () => {
        try {
        const transactionJson = await fetchAllTransactionByAdmin(token!);

        if ("data" in transactionJson) {
            const data = transactionJson.data;
            // setTransactions(data);

            // langsung gunakan data yg baru diambil
            const chartSellLivestock = totalSalesLivestock(data);
            const chartCareShelter = totalSalesCareShelter(data)
            setChartData({ 
                sellLivestock: chartSellLivestock,
                shelterCare: chartCareShelter 
            });
        } else {
            console.error("Error fetching transactions:", transactionJson.message);
            messageApi.open({
            type: "error",
            content: transactionJson.message,
            });
        }
        } catch (error) {
        console.error("Fetch error:", error);
        messageApi.open({
            type: "error",
            content: "Failed to fetch transactions",
        });
        }
    };

    const totalSalesLivestock = (trans: Transaction[]): ChartData[] => {
        return trans.map((tsl) => {
            const date = new Date(tsl.date_transaction);
            const name = date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
            return {
                name,
                sales: tsl.detail_buy.reduce((total, item) => total + item.sub_total, 0),
            };
        });
    };
    const totalSalesCareShelter = (trans: Transaction[]): ChartData[] => {
        return trans.map((tsl) => {
            const date = new Date(tsl.date_transaction);
            const name = date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
            return {
                name,
                sales: tsl.care_transaction.reduce((total, item) => total + item.sub_total, 0),
            };
        });
    };
    return (
      <div className="bg-[rgb(8,5,3)] min-h-screen overflow-x-hidden">
          <NavigationAdmin session={session} />
          <main className="flex flex-row text-[rgb(240,230,226)] min-h-screen">
            {/* for panel */}
            <section className="lg:w-[15%]">
                <AdminPanel session={session} />
            </section>
              {/* for content */}
              <section className="flex flex-col w-[100%] lg:w-[85%] p-[2rem] text-[rgb(240,230,226)] items-center px-[0.5rem] md:px-[1rem] xl:px-[2rem] 2xl:px-[20rem] gap-[1rem]">
                {contextHolder}
                  <h3 className="text-[1rem] md:text-[1.5rem] xl:text-[2rem] font-bold">Dashboard</h3>
                  {/* section persentase product */}
                    <section className="flex flex-col xl:flex-row min-w-full gap-[1rem]">
                      {/* card 1 */}
                        <section className="flex flex-col gap-[1rem] p-[1rem] overflow-hidden rounded-[0.4rem] border border-gray-500/40 w-full h-64 md:h-80 lg:h-96">    
                            <h5 className="font-bold">Data Sell Livestock</h5>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData.sellLivestock}>
                                <CartesianGrid stroke="rgb(240, 230, 226)" strokeDasharray="3 3" /> {/* Grid background */}
                                <XAxis dataKey="name" tick={{ fill: "rgb(240, 230, 226)" }} stroke="rgb(240, 230, 226)" /> {/* Label bulan di X-axis */}
                                <YAxis tickFormatter={formatNumber}  tick={{ fill: "rgb(240, 230, 226)" }} stroke="rgb(240, 230, 226)" /> {/* Skala angka di Y-axis */}
                                <Tooltip formatter={(value: number) => formatNumber(value)} /> {/* Tooltip interaktif */}
                                <Legend /> {/* Legend di atas chart */}
                                <Line
                                    type="monotone" // bikin garis halus
                                    dataKey="sales"
                                    stroke="#8884d8"
                                    strokeWidth={2}
                                    dot={{ r: 3 }} // titik di setiap data
                                    activeDot={{ r: 6 }} // titik besar saat hover
                                />
                                </LineChart>
                            </ResponsiveContainer>
                        </section>
                        <section className="flex flex-col gap-[1rem] p-[1rem] overflow-hidden rounded-[0.4rem] border border-gray-500/40 w-full h-64 md:h-80 lg:h-96">    
                            <h5 className="font-bold">Data Sell Livestock</h5>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData.shelterCare}>
                                <CartesianGrid stroke="rgb(240, 230, 226)" strokeDasharray="3 3" /> {/* Grid background */}
                                <XAxis dataKey="name" tick={{ fill: "rgb(240, 230, 226)" }} stroke="rgb(240, 230, 226)" /> {/* Label bulan di X-axis */}
                                <YAxis tickFormatter={formatNumber}  tick={{ fill: "rgb(240, 230, 226)" }} stroke="rgb(240, 230, 226)" /> {/* Skala angka di Y-axis */}
                                <Tooltip formatter={(value: number) => formatNumber(value)} /> {/* Tooltip interaktif */}
                                <Legend /> {/* Legend di atas chart */}
                                <Line
                                    type="monotone" // bikin garis halus
                                    dataKey="sales"
                                    stroke="#8884d8"
                                    strokeWidth={2}
                                    dot={{ r: 3 }} // titik di setiap data
                                    activeDot={{ r: 6 }} // titik besar saat hover
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