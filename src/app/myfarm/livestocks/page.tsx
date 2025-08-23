'use client'

import React, { useState } from 'react';
import { Layout, Menu, Table, Button, Input, Modal, Pagination } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Navbar from '@/components/navbar';
// import AdminPanel from '@/components/admin/admin-panel';

const { Content, Sider } = Layout;

const mockProducts = [
  { id: 1, title: 'Product 1', description: 'Description 1', price: 10, category: { name: 'Category A' }, images: ['/cow-not-found.png'] },
  { id: 2, title: 'Product 2', description: 'Description 2', price: 20, category: { name: 'Category B' }, images: ['/cow-not-found.png'] },
  { id: 3, title: 'Product 3', description: 'Description 3', price: 15, category: { name: 'Category C' }, images: ['/cow-not-found.png'] },
];

export default function AdminProductsDesign() {
  const [showModal, setShowModal] = useState(false);

  const columns = [
    {
      title: 'Product',
      dataIndex: 'title',
      key: 'title',
      render: (_: any, record: any) => (
        <div className="flex items-center gap-4">
          <img src={record.images[0]} className="w-12 h-12 rounded-full object-contain border" />
          <div>
            <p className="font-bold">{record.title}</p>
            <span className="text-sm">{record.description}</span>
          </div>
        </div>
      ),
    },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    { title: 'Category', dataIndex: ['category', 'name'], key: 'category' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <Button icon={<EditOutlined />} type="primary" size="small" onClick={() => setShowModal(true)}>Edit</Button>
          <Button icon={<DeleteOutlined />} danger size="small">Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar activeIconNav="login" />
      <Layout>
        <Sider width={250} className="bg-white">
          {/* <AdminPanel session={null} /> */}
        </Sider>
        <Layout>
          <Content className="p-6">
            <div className="flex justify-between mb-4">
              <h1 className="text-2xl font-bold">Handle Products</h1>
              <Button icon={<PlusOutlined />} type="primary" onClick={() => setShowModal(true)}>
                Add Product
              </Button>
            </div>

            {/* Search */}
            <div className="flex gap-2 mb-4">
              <Input placeholder="Search" />
              <Button type="primary">Search</Button>
            </div>

            {/* Table */}
            <Table
              dataSource={mockProducts}
              columns={columns}
              rowKey="id"
              pagination={false}
              bordered
            />

            {/* Pagination */}
            <div className="flex justify-end mt-4">
              <Pagination current={1} total={30} pageSize={10} showSizeChanger={false} />
            </div>

            {/* Modal */}
            <Modal
              title="Add / Edit Product"
              open={showModal}
              onCancel={() => setShowModal(false)}
              footer={null}
            >
              <p>Form goes here...</p>
            </Modal>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}
