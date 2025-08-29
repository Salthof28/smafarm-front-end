'use client'
import AdminPanel from "@/components/dashboard/adminPanel";
import NavigationAdmin from "@/components/dashboard/navigation";
import { fetchAllLivestock, fetchAllTransactionByAdmin, fetchAllUsers } from "@/services/api";
import { Livestock, Transaction, UserOut } from "@/types/interfaces";
import { message } from "antd";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface ChartData {
    name: string;
    sales: number;
};
interface DataCount {
    name: string;
    count: number;
};
export default function Dashboard () {
    const { data: session } = useSession();
    const token = session?.accessToken;
    // const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [chartData, setChartData] = useState<{
        sellLivestock: ChartData[],
        shelterCare: ChartData[],
        countUserByRole: DataCount[], 
        countLivestocksByCategory: DataCount[],
        totalAllLivestock: number
    }>({
        sellLivestock: [],
        shelterCare: [],
        countUserByRole: [],
        countLivestocksByCategory: [],
        totalAllLivestock: 0
    });
    const formatNumber = (value: number) => {
        if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1) + "B";
        if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
        if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
        return value.toString();
    };
    useEffect(() => {
        if (token) {
            fetchAlltransaction(token);
        }
    }, [token]);

    const fetchAlltransaction = async (token: string) => {
        try {
            const transactionJson = await fetchAllTransactionByAdmin(token);
            const userJson = await fetchAllUsers(token);
            const livestockJson = await fetchAllLivestock();
            if ("data" in transactionJson && "data" in livestockJson) {
                const data = transactionJson.data;
                const dataAllUser: UserOut[] = userJson.data;
                const dataLivestock: Livestock[] = livestockJson.data;
                // setTransactions(data);

                // langsung gunakan data yg baru diambil
                const chartSellLivestock = totalSalesLivestock(data).reverse();
                const chartCareShelter = totalSalesCareShelter(data).reverse();
                const countUserByRole = totalUserByRole(dataAllUser);
                const countLivestocks = totalLivestockByCategory(dataLivestock);
                const totalLivestock = totalAllLivestocks(dataLivestock);
                setChartData({ 
                    sellLivestock: chartSellLivestock,
                    shelterCare: chartCareShelter,
                    countUserByRole: countUserByRole,
                    countLivestocksByCategory: countLivestocks,
                    totalAllLivestock: totalLivestock
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
    // count sales livestocks
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
    // count sales cares
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
    // count sum user by role
    const totalUserByRole = (allUsers: UserOut[]): DataCount[] => {
        const countByRole = allUsers.reduce((acc, user) => {
                if (user.role === "CUSTOMER") acc.CUSTOMER += 1;
                if (user.role === "ADMIN") acc.ADMIN += 1;
                if (user.role === "BREEDER") acc.BREEDER += 1;
                return acc;
            },
            { CUSTOMER: 0, ADMIN: 0, BREEDER: 0 }
        );
        return [
            { name: "Customer", count: countByRole.CUSTOMER },
            { name: "Admin", count: countByRole.ADMIN },
            { name: "Breeder", count: countByRole.BREEDER },
        ]
    }
    // count sum livestock by category
    const totalLivestockByCategory = (allLivestocks: Livestock[]): DataCount[] => {
        const totalStockPerCategory = allLivestocks.reduce((acc, item) => {
            const categoryName = item.category.name;
                if (!acc[categoryName]) {
                    acc[categoryName] = 0;
                }
                acc[categoryName] += item.stock;
                return acc;
        }, {} as Record<string, number>);
        return Object.entries(totalStockPerCategory).map(([name, count]) => ({ name, count }));
    }
    // total livestock
    const totalAllLivestocks = (allLivestocks: Livestock[]): number => {
        return allLivestocks.reduce((sum, stock) => sum + stock.stock, 0);
    }

    const persentaseLivestock = (livestockByCat: number, totalLivesock: number): number => {
        const persenProduct: number = (livestockByCat/totalLivesock)*100;
        return persenProduct;
    }
    return (
      <div className="bg-[rgb(8,5,3)] min-h-screen overflow-x-hidden">
          <NavigationAdmin session={session} />
          <main className="flex flex-row text-[rgb(240,230,226)] min-h-screen">
            {/* for panel */}
            <section className="lg:w-[15%] z-50">
                <AdminPanel session={session} />
            </section>
              {/* for content */}
              <section className="flex flex-col w-[100%] lg:w-[85%] p-[2rem] text-[rgb(240,230,226)] items-center px-[0.5rem] md:px-[1rem] xl:px-[2rem] 2xl:px-[20rem] gap-[1rem]">
                {contextHolder}
                  <h3 className="text-[1rem] md:text-[1.5rem] xl:text-[2rem] font-bold">Dashboard</h3>
                    <section className="flex flex-col xl:flex-row min-w-full gap-[1rem]">
                        {chartData.countUserByRole.map((countRole, index) => (
                            <section key={index} className="flex flex-col gap-[1rem] p-[1rem] overflow-hidden rounded-[0.4rem] border border-gray-500/40 w-full h-64 md:h-80 lg:h-96 justify-between">
                                <h4>{countRole.name} User</h4> 
                                <h2 className="text-center">{countRole.count}</h2>   
                                <h4 className="text-end">Users</h4>
                            </section>
                        ))}
                    </section>
                  {/* section persentase product */}
                    <section className="flex flex-col xl:flex-row min-w-full gap-[1rem]">
                      {/* card 1 */}
                        <section className="flex flex-col gap-[1rem] p-[1rem] overflow-hidden rounded-[0.4rem] border border-gray-500/40 w-full h-64 md:h-80 lg:h-96">    
                            <h5 className="font-bold">Data Sales Livestock</h5>
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
                            <h5 className="font-bold">Care Sales Livestock</h5>
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
                                    activeDot={{ r: 6 }} 
                                />
                                </LineChart>
                            </ResponsiveContainer>
                        </section>
                    </section>
                    <section className="flex flex-col gap-[1rem] p-[1rem] overflow-hidden rounded-[0.4rem] border border-gray-500/40 w-full">    
                        <h4 className="text-[1rem] md:text-[1.2rem] xl:text-[1.5rem] font-bold">Livestock Stocks</h4>
                        {chartData.countLivestocksByCategory.map((item,index) => (
                        <div key={index} className="flex flex-col gap-[0.5rem]">
                            <div className="flex flex-row justify-between">
                                <p className="text-[0.6rem] md:text-[0.8rem] xl:text-[1rem] font-bold">{item.name}</p>
                                <p className="text-[0.6rem] md:text-[0.8rem] xl:text-[1rem] font-bold">{item.count} Heads</p>
                            </div>
                            <div className="bg-gray-200 w-full h-[0.3rem] md:h-[0.6rem] rounded-[0.5rem]">
                                <div data-testid='progressbar' className={`bg-emerald-600 h-[0.3rem] md:h-[0.6rem] rounded-[0.5rem]`} style={{ width: `${persentaseLivestock(item.count, chartData.totalAllLivestock)}%` }}></div>
                            </div>
                        </div>
                        ))}
                        </section>
              </section>
          </main>
      </div>
    )
}