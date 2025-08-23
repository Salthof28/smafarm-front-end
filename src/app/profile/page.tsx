'use client'

import React, { useState } from 'react';
import { LaptopOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import Navbar from '@/components/navbar';
import ProfileCustomerDetail from '@/components/customer/profile-customer-detail';
import useAuth from '@/hooks/useAuth';
import { fetchLogout } from '@/services/api';
import { signOut } from 'next-auth/react';
import EditProfile from '@/components/customer/edit-profile-customer';

const { Content, Sider } = Layout;

export default function ProfileCustomer() {
    const { session, router } = useAuth();
    const [showForm, setShowForm] = useState<boolean>(false);
    
    const logOut = async (): Promise<void> => {
        if (!session?.accessToken) {
            console.error("No access token found");
            return;
        };
        await fetchLogout(session?.accessToken);      
        signOut({callbackUrl: "/login"});
    }

    const items2: MenuProps['items'] = [
        { icon: UserOutlined, label: 'Profile', path: '/profile' },
        { icon: LaptopOutlined, label: 'History Transaction', path: '/profile/history' },
        { icon: LogoutOutlined, label: 'Sign Out', action: logOut }
        // { icon: NotificationOutlined, label: 'Notifications', path: '/dashboard/notifications' }
    ].map((item, index) => ({
        key: `menu-${index}`,
        icon: React.createElement(item.icon),
        label: item.label,
        onClick: item.action ? item.action : () => router.push(item.path), // ini bagian navigasinya
    }));
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

  return (
    <div className="bg-amber-100 w-full min-h-screen overflow-x-hidden">
      <Navbar activeIconNav="login"/>
      <div className='mt-[6rem] lg:mt-[12rem] flex justify-center py-[1rem]'>
        <div className='w-[95vw] lg:w-[85vw] 2xl:w-[50vw] shadow-md h-[45vh] md:h-[43vh] lg:h-[46vh] xl:h-[50vh] 2xl:h-[45vh]'  >
          <Layout
            style={{ padding: '24px 0', background: '#fffbeb', borderRadius: borderRadiusLG, height: '100%' }}
          >
            <Sider style={{ background: colorBgContainer}} width={250} breakpoint="md" collapsedWidth={0}>
              <Menu
                mode="inline"
                defaultSelectedKeys={['menu-0']}
                style={{ height: '100%', background: '#fffbeb', overflowY: 'auto' }}
                items={items2}
              />
              
            </Sider>
            <Content style={{ padding: '0 24px', minHeight: 280, overflowY: 'auto' }}>
                <ProfileCustomerDetail showForm={() => setShowForm(true)} />
            </Content>
            {showForm === true && (
            <>
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={() => setShowForm(false)} />
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
                    <EditProfile hiddenForm={() => setShowForm(false)} />
                </div>
            </>
            )}

          </Layout>

        </div>
      </div>
    </div>
  );
}
