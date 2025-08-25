'use client'
import React, { useEffect, useState } from 'react';
import { Layout, Table, Button, Input, Modal, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Content } from 'antd/es/layout/layout';
import { Category, Livestock } from '@/types/interfaces';
import { fetchAllCategory, fetchAllLivestock, fetchDeleteLivestock } from '@/services/api';
import { useSession } from 'next-auth/react';
import FormLivestockBreeder from './form-livestock';


export default function LivestockBreederList() {
    const { data: session } = useSession()
    const [livestocks, setLivestocks] = useState<Livestock[]>([]);
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState<Category[]>([]);
    const [statusForm, setStatusForm] = useState<string>("")
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentLivestock, setCurrentLivestock] = useState<Livestock | undefined>(undefined)

    const fetchLivestock = async () => {
        const farm_id = session?.user.profile?.farmId
        setLoading(true);
        const res = await fetchAllLivestock(undefined, undefined, farm_id); 
        if ('data' in res) {
            setLivestocks(res.data);
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
            fetchLivestock();
            fetchCategory();
        }
    }, [showModal]);

    const handleShowForm = (status: string, livestock?: Livestock) => {
        if(status === "Edit" && livestock) {
            setStatusForm(status);
            setCurrentLivestock(livestock)
            setShowModal(true);
        } else {
            setStatusForm(status);
            setShowModal(true);
        }
    }

    const handleDelete = async (id: number) => {
        const token = session?.accessToken
        if (token){
            const deleteShelter = await fetchDeleteLivestock(id, token);
            if("data" in deleteShelter){
                message.success('delete success');
                fetchLivestock();
            } else {
                message.error('delete failed')
            }
        }
    }

    const columns = [
        {
            title: 'Livestocks',
            dataIndex: 'title',
            key: 'title',
            render: (_: unknown, record: Livestock) => (
            <div className="flex flex-row items-center gap-4">
                <img src={record?.img_livestock?.[0]?.url || '/cow-not-found.png'}  className="w-12 h-12 rounded-full object-contain border max-lg:hidden" />
                <div>
                    <p className="font-bold max-md:text-[0.6rem]">{record.name}</p>
                    <span className="text-sm max-xl:hidden">{record.location.slice(0,41)}{record.location.length > 41 ? '...' : ''}</span>
                </div>
            </div>
            ),
        },
        { title: 'Price', dataIndex: 'price', key: 'price',
            render: (price: number) => `Rp ${price.toLocaleString('id-ID')}`,
        },
        { title: 'Category', dataIndex: ['category', 'name'], key: 'category' },
        {
            title: 'Stock',
            dataIndex: 'stock',
            key: 'stock',
            render: (stock: number) => <span> {stock} Heads</span>, 
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: unknown, record: Livestock) => (
            <div className="flex flex-col xl:flex-row  gap-2">
                
                <Button icon={<EditOutlined />} type="primary" size="small" onClick={() => handleShowForm("Edit", record)} >Edit</Button>
                
                <Button icon={<DeleteOutlined />} danger size="small" onClick={() => handleDelete(record.id)} >Delete</Button>
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
                        onClick={() => handleShowForm("Create")}
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
                    dataSource={livestocks}
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
                        <FormLivestockBreeder livestock={currentLivestock} category={category} hiddenForm={() => setShowModal(false)} statusForm={statusForm} />
                    </Modal>
                </Content>
            </Layout>
        </div>
    )
}