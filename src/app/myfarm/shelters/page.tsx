'use client'

import React, { Suspense } from 'react';
import { BankOutlined, LaptopOutlined, LogoutOutlined, ShopOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import Navbar from '@/components/navbar';
import { fetchLogout } from '@/services/api';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ShelterBreederList from '@/components/myfarm/shelter-list';

const { Content, Sider } = Layout;

export default function SheltersBreeder() {
    // const { session, router } = useAuth();
    const router = useRouter()
    const { data: session } = useSession()
    // const [formFarm, setFormFarm] = useState<boolean>(false);

    const logOut = async (): Promise<void> => {
        if (!session?.refreshToken) {
            console.error("No access token found");
            return;
        }
        await fetchLogout(session?.refreshToken);      
        signOut({ callbackUrl: "/login" });
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
                <div className='w-[95vw] lg:w-[85vw] 2xl:w-[50vw] shadow-md h-[45vh] md:h-[43vh] lg:h-[46vh] xl:h-[50vh] 2xl:h-[45vh]'>
                    <Layout
                        style={{ padding: '24px 0', background: '#fffbeb', borderRadius: borderRadiusLG, height: '100%' }}
                    >
                        <Sider style={{ background: colorBgContainer }} width={250} breakpoint="lg" collapsedWidth={0}>
                            <Menu
                                mode="inline"
                                defaultSelectedKeys={['shelters']}
                                defaultOpenKeys={['myfarm', 'history']}
                                style={{ height: '100%', background: '#fffbeb', overflowY: 'auto' }}
                                items={items2}
                            />
                        </Sider>
                        <Content style={{ padding: '0 24px', minHeight: 280, overflowY: 'auto' }}>
                            <ShelterBreederList />
                        </Content>

                    </Layout>
                </div>
            </div>
        </div>
    );
}
