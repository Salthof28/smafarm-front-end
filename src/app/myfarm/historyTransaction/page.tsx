'use client'

import React, { Suspense, useEffect, useState } from 'react';
import { BankOutlined, LaptopOutlined, LogoutOutlined, ShopOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, message, theme } from 'antd';
import Navbar from '@/components/navbar';
import { fetchHistoryTransaction, fetchLogout } from '@/services/api';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { CareTransaction, Transaction } from '@/types/interfaces';
import HistoryCustomerChild from '@/components/customer/history-customer';
import ConfirmFormTransactionCustomer from '@/components/customer/confirm-transaction';
import FormHistoryCustomer from '@/components/customer/form-history';

const { Content, Sider } = Layout;

export default function HistoryTransactionBreeder() {
    const { data: session } = useSession();
    const router = useRouter()
    const [history, setHistory] = useState<Transaction[]>([]);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [statusForm, setStatusForm] = useState<string>("");
    const [currentId, setCurrentId] = useState<number>(0);
    const [currentCare, setCurrentCareCare] = useState<CareTransaction>();

    const fetchHisotory = async () => {
        const token = session?.accessToken
        if(!token){
            message.error("Token not found. Please login again.");
            return;
        }
        const historyJson = await fetchHistoryTransaction(token);
        if("data" in historyJson){
            const historyData = historyJson.data;
            setHistory(historyData);
        return
        }
    }
    useEffect(() => {
        if(showForm === false){
        fetchHisotory()
        }
    },[session, showForm])

    const logOut = async (): Promise<void> => {
        if (!session?.refreshToken) {
            console.error("No access token found");
            return;
        }
        await fetchLogout(session?.refreshToken);      
        signOut({ callbackUrl: "/login" });
    }

  const handleReshedule = (care: CareTransaction) => {
    setStatusForm("Reshedule");
    setCurrentCareCare(care)
    setShowForm(true)
  }

  const handleDrop = (id_transaction: number) => {
    setStatusForm("Drop");
    setCurrentId(id_transaction);
    setShowForm(true);
  }

  const handleFinish = (id_transaction: number) => {
    setStatusForm("Finish");
    setCurrentId(id_transaction);
    setShowForm(true)
  }


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
                <div className='w-[95vw] lg:w-[85vw] 2xl:w-[50vw] shadow-md h-[45vh] md:h-[43vh] lg:h-[46vh] xl:h-[50vh] 2xl:h-[45vh]'>
                    <Layout
                        style={{ padding: '24px 0', background: '#fffbeb', borderRadius: borderRadiusLG, height: '100%' }}
                    >
                        <Sider style={{ background: colorBgContainer }} width={250} breakpoint="lg" collapsedWidth={0}>
                            <Menu
                                mode="inline"
                                defaultSelectedKeys={['transaction']}
                                defaultOpenKeys={['myfarm', 'history']}
                                style={{ height: '100%', background: '#fffbeb', overflowY: 'auto' }}
                                items={items2}
                            />
                        </Sider>
                        <Content style={{ padding: '0 24px', minHeight: 280, overflowY: 'auto' }}>
                            <HistoryCustomerChild history={history} showForm={() => setShowForm(true)} handleReshedule={handleReshedule} handleDrop={handleDrop} handleFinish={handleFinish} />
                        </Content>

                        {showForm === true && currentCare && statusForm === "Reshedule" && (
                        <>
                            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={() => setShowForm(false)} />
                            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
                                <FormHistoryCustomer hiddenForm={() => setShowForm(false)} care={currentCare}  />
                            </div>
                        </>
                        )}

                        {showForm === true && ["Drop", "Finish"].includes(statusForm) && (
                        <>
                            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={() => setShowForm(false)} />
                            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
                                <ConfirmFormTransactionCustomer hiddenForm={() => setShowForm(false)} statusForm={statusForm} currentId={currentId} />
                            </div>
                        </>
                        )}

                    </Layout>
                </div>
            </div>
        </div>
    );
}
