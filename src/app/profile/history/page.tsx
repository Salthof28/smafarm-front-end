'use client'

import React, { useEffect, useState } from 'react';
import { LaptopOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, message, theme } from 'antd';
import Navbar from '@/components/navbar';
import ProfileCustomerDetail from '@/components/customer/profile-customer-detail';
import useAuth from '@/hooks/useAuth';
import { fetchHistoryTransaction, fetchLogout } from '@/services/api';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import HistoryCustomerChild from '@/components/customer/history-customer';
import { Transaction } from '@/types/interfaces';

const { Content, Sider } = Layout;

export default function HistoryCustomer() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [history, setHistory] = useState<Transaction[]>([])
  
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
    fetchHisotory()
  })

  useEffect(() => {
      if (status === "unauthenticated") {
      router.push("/login");
      } else if (session?.user?.role === "BREEDER") {
      router.replace("/dashboard");
      } else if (session?.user?.role === "ADMIN") {
      router.replace("/dashboard");
      }
  }, [status, session, router]);
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
        <div className='w-[85vw] 2xl:w-[50vw]'>
          <Layout
            style={{ padding: '24px 0', background: colorBgContainer, borderRadius: borderRadiusLG }}
          >
            <Sider style={{ background: colorBgContainer }} width={250} breakpoint="md" collapsedWidth={0}>
              <Menu
                mode="inline"
                defaultSelectedKeys={['menu-1']}
                style={{ height: '100%' }}
                items={items2}
              />
              
            </Sider>
            <Content style={{ padding: '0 24px', minHeight: 280 }}>
                <HistoryCustomerChild history={history} />
            </Content>
          </Layout>
        </div>
      </div>
    </div>
  );
}
