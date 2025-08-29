'use client'

import React, { Suspense, useEffect, useState } from 'react';
import { BankOutlined, LaptopOutlined, LogoutOutlined, ShopOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, message, theme } from 'antd';
import Navbar from '@/components/navbar';
import { fetchHistoryTransactionBreeder, fetchLogout } from '@/services/api';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Transaction } from '@/types/interfaces';
import HistoryBreederChild from '@/components/myfarm/history-breeder';
import ConfirmOrderCustomer from '@/components/myfarm/confirm-order';
import ShowDashboardBreeder from '@/components/myfarm/dashboard-breeder';

const { Content, Sider } = Layout;
interface ChartData {
    name: string;
    sales: number;
};
export default function DashboardBreeder() {
    const { data: session } = useSession();
    const router = useRouter();
    const token = session?.accessToken;
    const [messageApi, contextHolder] = message.useMessage();
    const [chartData, setChartData] = useState<{
        sellLivestock: ChartData[],
        shelterCare: ChartData[],
    }>({
        sellLivestock: [],
        shelterCare: [],
    });
    // const [formFarm, setFormFarm] = useState<boolean>(false);

    const fetchAlltransaction = async (token: string) => {
        try{
            const transactionJson = await fetchHistoryTransactionBreeder(token);
            if("data" in transactionJson){
                const data = transactionJson.data;
                const chartSellLivestock = totalSalesLivestock(data).reverse();
                const chartCareShelter = totalSalesCareShelter(data).reverse();
                setChartData({ 
                    sellLivestock: chartSellLivestock,
                    shelterCare: chartCareShelter,
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
    }
    useEffect(() => {
        if (token) {
            fetchAlltransaction(token);
        }
    },[token])

    const logOut = async (): Promise<void> => {
        if (!session?.refreshToken) {
            console.error("No access token found");
            return;
        }
        await fetchLogout(session?.refreshToken);      
        signOut({ callbackUrl: "/login" });
    }
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
    const items2: MenuProps['items'] = [
        {
            key: 'profile',
            icon: React.createElement(UserOutlined),
            label: 'Profile',
            onClick: () => router.push('/myfarm')
        },
        {
            key: 'myfarm',
            icon: React.createElement(BankOutlined),
            label: 'My Farm',
            children: [
                {
                    key: 'dashboard',
                    icon: React.createElement(ShopOutlined),
                    label: 'Dashboard',
                    onClick: () => router.push('/myfarm/dashboard'),
                },
                {
                    key: 'shelters',
                    icon: React.createElement(ShopOutlined),
                    label: 'Shelters',
                    onClick: () => router.push('/myfarm/shelters'),
                },
                {
                    key: 'livestocks',
                    icon: React.createElement(ShopOutlined),
                    label: 'Livestocks',
                    onClick: () => router.push('/myfarm/livestocks'),
                },
            ]
        },
        {
            key: 'history',
            icon: React.createElement(LaptopOutlined),
            label: 'History Transaction',
            children: [
                {
                    key: 'order',
                    icon: React.createElement(ShopOutlined),
                    label: 'Order',
                    onClick: () => router.push('/myfarm/historyOrder'),
                },
                {
                    key: 'transaction',
                    icon: React.createElement(ShopOutlined),
                    label: 'Transaction',
                    onClick: () => router.push('/myfarm/historyTransaction'),
                },
            ]
        },
        {
            key: 'signout',
            icon: React.createElement(LogoutOutlined),
            label: 'Sign Out',
            onClick: logOut
        }
    ];

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <div className="bg-amber-100 w-full min-h-screen overflow-x-hidden">
            <Suspense fallback={<div>Loading...</div>}>
                <Navbar activeIconNav="login"/>
            </Suspense>
            <div className='mt-[6rem] lg:mt-[12rem] flex justify-center py-[1rem]'>
                {contextHolder}
                <div className='w-[95vw] lg:w-[85vw] 2xl:w-[50vw] shadow-md h-[45vh] md:h-[43vh] lg:h-[46vh] xl:h-[50vh] 2xl:h-[45vh]'>
                    <Layout
                        style={{ padding: '24px 0', background: '#fffbeb', borderRadius: borderRadiusLG, height: '100%' }}
                    >
                        <Sider style={{ background: colorBgContainer }} width={250} breakpoint="lg" collapsedWidth={0}>
                            <Menu
                                mode="inline"
                                defaultSelectedKeys={['dashboard']}
                                defaultOpenKeys={['myfarm', 'history']}
                                style={{ height: '100%', background: '#fffbeb', overflowY: 'auto' }}
                                items={items2}
                            />
                        </Sider>
                        <Content style={{ padding: '0 24px', minHeight: 280, overflowY: 'auto' }}>
                            <ShowDashboardBreeder chartData={chartData}  />
                        </Content>


                    </Layout>
                </div>
            </div>
        </div>
    );
}
