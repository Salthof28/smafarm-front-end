'use client'

import React, { useEffect, useState } from 'react';
import { BankOutlined, LaptopOutlined, LogoutOutlined, ShopOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import Navbar from '@/components/navbar';
import ProfileCustomerDetail from '@/components/customer/profile-customer-detail';
import useAuth from '@/hooks/useAuth';
import { fetchLogout } from '@/services/api';
import { signOut, useSession } from 'next-auth/react';
import EditProfile from '@/components/customer/edit-profile-customer';
import CreatedFarm from '@/components/myfarm/form-create-farm';
import { useRouter } from 'next/navigation';
import ShelterBreederList from '@/components/myfarm/shelter-list';

const { Content, Sider } = Layout;

export default function LivestocksBreeder() {
    // const { session, router } = useAuth();
    const router = useRouter()
    const { data: session } = useSession()
    const [showForm, setShowForm] = useState<boolean>(false);
    // const [formFarm, setFormFarm] = useState<boolean>(false);

    const logOut = async (): Promise<void> => {
        if (!session?.accessToken) {
            console.error("No access token found");
            return;
        }
        await fetchLogout(session.accessToken);      
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
            onClick: () => router.push('/myfarm/history')
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
            <Navbar activeIconNav="login"/>
            <div className='mt-[6rem] lg:mt-[12rem] flex justify-center py-[1rem]'>
                <div className='w-[95vw] lg:w-[85vw] 2xl:w-[50vw] shadow-md h-[45vh] md:h-[43vh] lg:h-[46vh] xl:h-[50vh] 2xl:h-[45vh]'>
                    <Layout
                        style={{ padding: '24px 0', background: '#fffbeb', borderRadius: borderRadiusLG, height: '100%' }}
                    >
                        <Sider style={{ background: colorBgContainer }} width={250} breakpoint="lg" collapsedWidth={0}>
                            <Menu
                                mode="inline"
                                defaultSelectedKeys={['shelters']}
                                defaultOpenKeys={['myfarm']}
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
