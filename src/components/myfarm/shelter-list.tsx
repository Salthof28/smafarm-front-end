'use client'

import React, { useEffect, useState } from 'react';
import { Layout, Menu, Table, Button, Input, Modal, Pagination } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Content } from 'antd/es/layout/layout';
import { Shelter } from '@/types/interfaces';
import { fetchAllShelter } from '@/services/api';
import { useSession } from 'next-auth/react';


export default function ShelterBreederList() {
    const { data: session } = useSession()
    const [shelters, setShelters] = useState<Shelter[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    const fetchShelter = async () => {
        const farm_id = session?.user.profile?.farmId
        setLoading(true);
        const res = await fetchAllShelter(undefined, undefined, farm_id); 
        if ('data' in res) {
            setShelters(res.data);
            shelters[0].accomodate
        } 
        else {
            console.error('Error fetching shelters:', res);
        }
        setLoading(false);
    }
    useEffect(() => {
        if (session?.user?.profile?.farmId) {
            fetchShelter();
        }
    }, [session]);

    const columns = [
    {
        title: 'Shelters',
        dataIndex: 'title',
        key: 'title',
        render: (_: any, record: any) => (
        <div className="flex items-center gap-4">
            <img src={record.images?.[0] || '/cow-not-found.png'}  className="w-12 h-12 rounded-full object-contain border max-lg:hidden" />
            <div>
                <p className="font-bold">{record.name}</p>
                <span className="text-sm max-xl:hidden">{record.location.slice(0,41)}{record.location.length > 41 ? '...' : ''}</span>
            </div>
        </div>
        ),
    },
    { title: 'Price', dataIndex: 'price_daily', key: 'price',
        render: (price: number) => `Rp ${price.toLocaleString('id-ID')}`,
     },
    { title: 'Category', dataIndex: ['category', 'name'], key: 'category' },
    {
        title: 'Accommodate',
        dataIndex: 'accomodate',
        key: 'accomodate',
        render: (accomodate: number) => <span>{accomodate} Heads</span>, 
    },
    {
        title: 'Actions',
        key: 'actions',
        render: (_: any, record: any) => (
        <div className="flex flex-col xl:flex-row  gap-2">
            <Button icon={<EditOutlined />} type="primary" size="small">Edit</Button>
            <Button icon={<DeleteOutlined />} danger size="small">Delete</Button>
        </div>
        ),
    },
    ];


    return(
        <div>
            <Layout style={{ background: '#fffbeb' }}>
                <Content className="p-6">
                    <div className="flex justify-between mb-4">
                        <h4 className="text-2xl font-bold">Handle Shelters</h4>
                        <Button icon={<PlusOutlined />} type="primary" 
                        // onClick={() => setShowModal(true)}
                        >
                            Add Shelters
                        </Button>
                    </div>

                    {/* Search */}
                    <div className="flex gap-2 mb-4">
                    <Input
                        placeholder="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button type="primary">Search</Button>
                    </div>

                    {/* Table */}
                    <Table
                    dataSource={shelters}
                    columns={columns}
                    rowKey="id"
                    loading={loading}
                    pagination={false}
                    bordered
                    />

                    {/* Modal */}
                    <Modal
                    title="Add / Edit Product"
                    // open={showModal}
                    // onCancel={() => setShowModal(false)}
                    footer={null}
                    >
                    <p>Form goes here...</p>
                    </Modal>
                </Content>
            </Layout>
        </div>
    )
}