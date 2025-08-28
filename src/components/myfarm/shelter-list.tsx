'use client'

import React, { useEffect, useState } from 'react';
import { Layout, Table, Button, Input, Modal, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Content } from 'antd/es/layout/layout';
import { Category, Shelter } from '@/types/interfaces';
import { fetchAllCategory, fetchAllShelter, fetchDeleteShelter } from '@/services/api';
import { useSession } from 'next-auth/react';
import FormShelterBreeder from './form-shelter';


export default function ShelterBreederList() {
    const { data: session } = useSession()
    const [shelters, setShelters] = useState<Shelter[]>([]);
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState<Category[]>([]);
    const [statusForm, setStatusForm] = useState<string>("")
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentShelter, setCurrentShelter] = useState<Shelter | undefined>(undefined)

    const fetchShelter = async (name?: string) => {
        const farm_id = session?.user.profile?.farmId
        setLoading(true);
        const res = await fetchAllShelter(undefined, name, farm_id); 
        if ('data' in res) {
            setShelters(res.data);
        } else {
            console.error('Error fetching shelters:', res);
        }
        setLoading(false);
    }
    const fetchCategory = async () => {
        const res = await fetchAllCategory() 
        if ('data' in res) {
            setCategory(res.data);
        } else {
            console.error('Error fetching category:', res);
        }
    }
    useEffect(() => {
        if (showModal === false) {
            fetchShelter();
            fetchCategory();
        }
    }, [showModal]);

    const handleShowForm = (status: string, shelter?: Shelter) => {
        if(status === "Edit" && shelter) {
            setStatusForm(status);
            setCurrentShelter(shelter)
            setShowModal(true);
        } else {
            setStatusForm(status);
            setShowModal(true);
        }
    }

    const handleDelete = async (id: number) => {
        const token = session?.accessToken
        if (token){
            const deleteShelter = await fetchDeleteShelter(id, token);
            if("data" in deleteShelter){
                message.success('delete success');
                fetchShelter();
            } else {
                message.error('delete failed')
            }
        }
    }

    const columns = [
        {
            title: 'Shelters',
            dataIndex: 'title',
            key: 'title',
            render: (_: unknown, record: Shelter) => (
            <div className="flex flex-row items-center gap-4">
                <img src={record.img_shelter?.[0]?.url || '/cow-not-found.png'}  className="w-12 h-12 rounded-full object-contain border max-lg:hidden" />
                <div>
                    <p className="font-bold max-md:text-[0.6rem]">{record.name}</p>
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
            render: (_: unknown, record: Shelter) => (
            <div className="flex flex-col xl:flex-row  gap-2">
                <Button icon={<EditOutlined />} type="primary" size="small" onClick={() => handleShowForm("Edit", record)}>Edit</Button>
                <Button icon={<DeleteOutlined />} danger size="small" onClick={() => handleDelete(record.id)}>Delete</Button>
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
                        <Button icon={<PlusOutlined />} type="primary" onClick={() => handleShowForm("Create")}>
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
                    <Button onClick={() => fetchShelter(search)} type="primary">Search</Button>
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
                    title={`${statusForm} Shelter`}
                    open={showModal}
                    onCancel={() => setShowModal(false)}
                    footer={null}
                    >
                        <FormShelterBreeder shelter={currentShelter} category={category} hiddenForm={() => setShowModal(false)} statusForm={statusForm} />
                    </Modal>
                </Content>
            </Layout>
        </div>
    )
}