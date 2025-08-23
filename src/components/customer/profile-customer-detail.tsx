'use client'
import { fetchUploadProfile } from '@/services/api';
import { MailOutlined, PhoneOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import { Upload, Button, message, Spin } from 'antd';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

interface ProfileCustomerDetailProp {
    showForm: () => void;
}

export default function ProfileCustomerDetail({ showForm }: ProfileCustomerDetailProp) {
    const { data: session, update } = useSession();
    const [loading, setLoading] = useState(false);

    const handleUpload = async (file: File) => {
        if (!session?.accessToken) {
            message.error("Token not found. Please login again.");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        try {
            const data = await fetchUploadProfile(formData, session.accessToken);

            if (data?.data?.img_profile) {
                // update session
                await update({
                    trigger: "update",
                    user: {
                        ...session.user,
                        profile: {
                            ...session.user.profile,
                            img_profile: data.data.img_profile,
                        },
                    },
                });
                message.success(`${file.name} uploaded successfully!`);
            }

            if (data?.message) {
                message.error(data.message);
            }
        } catch (err) {
            console.error(err);
            message.error(`${file.name} upload failed`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex flex-col gap-[1rem] px-[1rem] lg:px-[2rem] items-center'>
            <div className='flex flex-col p-[1rem] justify-center items-center rounded-[1rem] shadow-md w-full'>
                <img
                    src={session?.user.profile?.img_profile || "/cow-not-found.png"}
                    className='mb-[2rem] w-[10rem] lg:w-[12rem] shadow-md rounded-[1rem] h-[15rem] lg:h-[17rem] object-cover'
                />

                <Upload
                    accept="image/*"
                    beforeUpload={(file) => {
                        handleUpload(file);
                        return false; // supaya Ant Design tidak upload otomatis
                    }}
                    showUploadList={false}
                >
                    <Button loading={loading} icon={<UploadOutlined />}>
                        {loading ? <Spin size="small" /> : "Upload Photo"}
                    </Button>
                </Upload>

                <h4>Welcome {session?.user.profile?.name}</h4>
            </div>

            <div className='flex flex-col md:flex-row pt-[2vh] justify-between w-full'>
                <div className='flex flex-row gap-[0.2rem]'>
                    <UserOutlined className="text-sm md:text-lg lg:text-2xl" />
                    <p>{session?.user.profile?.name}</p>
                </div>
                <div className='flex flex-row gap-[0.2rem]'>
                    <MailOutlined className="text-sm md:text-lg lg:text-2xl" />
                    <p>{session?.user.profile?.email}</p>
                </div>
                <div className='flex flex-row gap-[0.2rem]'>
                    <PhoneOutlined className="text-sm md:text-lg lg:text-2xl" />
                    <p>{session?.user.profile?.phone}</p>
                </div>
            </div>

            <button
                onClick={showForm}
                className="bg-emerald-500 p-[0.3rem] xl:p-[0.5rem] rounded-[0.4rem] hover:bg-emerald-700 hover:text-white active:scale-95 duration-200 text-[0.4rem] md:text-[0.6rem] xl:text-[0.8rem] w-[6rem] md:w-[7rem] xl:w-[10rem]"
            >
                Change Profile
            </button>
        </div>
    );
}
