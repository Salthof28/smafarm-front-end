import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
interface ChartData {
    name: string;
    sales: number;
};
interface ShowDashboardBreederProp {
    chartData: {
        sellLivestock: ChartData[],
        shelterCare: ChartData[],
    }
}
export default function ShowDashboardBreeder({ chartData }: ShowDashboardBreederProp) {
    const formatNumber = (value: number) => {
        if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1) + "B";
        if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
        if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
        return value.toString();
    };
    return (
        <div className="flex flex-col xl:flex-col min-w-full gap-[1rem]">
            <h4>Dasboard Breeder</h4>
            <section className="flex flex-col gap-[1rem] p-[1rem] overflow-hidden rounded-[0.4rem] border border-gray-500/40 w-full h-64 md:h-80 lg:h-96">    
                <h5 className="font-bold">Data Sales Livestock</h5>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData.sellLivestock}>
                    <CartesianGrid stroke="rgb(240, 230, 226)" strokeDasharray="3 3" /> {/* Grid background */}
                    <XAxis dataKey="name" /> {/* Label bulan di X-axis */}
                    <YAxis tickFormatter={formatNumber}  /> {/* Skala angka di Y-axis */}
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
                    <XAxis dataKey="name" /> {/* Label bulan di X-axis */}
                    <YAxis tickFormatter={formatNumber} /> {/* Skala angka di Y-axis */}
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
        </div>
    )
}