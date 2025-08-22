'use client'
import { fetchUploadProfile } from '@/services/api';
import { MailOutlined, PhoneOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import { Button, message } from 'antd/lib';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';

import { useState } from 'react';

interface ProfileCustomerDetailProp {
    session: Session | null
    showForm: () => void;
}
export default function ProfileCustomerDetail({session, showForm}: ProfileCustomerDetailProp) {
    const [loading, setLoading] = useState(false);
    const { data: currentSession, update } = useSession();

    const handleUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file); // nama field harus sama dengan @UploadedFile('file') di NestJS

        try {
            const token = session?.accessToken;
            if(!token){
                message.error(`${file.name} upload failed`);
                return;
            }
            setLoading(true);
            const data = await fetchUploadProfile(formData, token);
            console.log(data);
            message.success(`${file.name} uploaded successfully`);
            setLoading(false);
            if (data?.img_profile) {
                await update({
                    ...currentSession,
                    user: {
                        ...currentSession?.user,
                        profile: {
                            ...currentSession?.user?.profile,
                            image: data.img_profile,
                        },
                    },
                });
            }
            if (data?.message) {
                message.error(data.message);
                console.log(data.message)
            } 
            console.log(session?.user.profile?.img_profile)
        } catch (err) {
            console.error(err);
            message.error(`${file.name} upload failed`);
        }
    };

    return(
        <div className='flex flex-col gap-[1rem] px-[2rem] items-center'>
            <div className='flex flex-col p-[1rem] justify-center items-center rounded-[1rem] shadow-md w-full'>
                <img src={currentSession?.user.profile?.img_profile || "/cow-not-found.png"} className='mb-[2rem] w-[12rem] shadow-2xs rounded-[1rem]' />
                <Upload
                    accept="image/*"
                    beforeUpload={(file) => {
                        handleUpload(file);
                        return false; // supaya Ant Design tidak upload otomatis
                    }}
                    showUploadList={false} // sembunyikan list default
                    >
                    <Button loading={loading} icon={<UploadOutlined />}>
                        Upload Photo
                    </Button>
                </Upload>
                <h4>Welcome {session?.user.profile?.name}</h4>
            </div>
            <div className='flex flex-row pt-[2vh] justify-between w-full'>
                <div className='flex flex-row gap-[0.2rem]'>
                    <UserOutlined className="text-2xl" />
                    <p>{session?.user.profile?.name}</p>
                </div>
                <div className='flex flex-row gap-[0.2rem]'>
                    <MailOutlined className="text-2xl" />
                    <p>{session?.user.profile?.email}</p>
                </div>
                <div className='flex flex-row gap-[0.2rem]'>
                    <PhoneOutlined className="text-2xl" />
                    <p>{session?.user.profile?.phone}</p>
                </div>

            </div>
            <button onClick={showForm} className="bg-emerald-500 p-[0.3rem] xl:p-[0.5rem] rounded-[0.4rem] hover:bg-emerald-700 hover:text-white active:scale-95 duration-200 text-[0.4rem] md:text-[0.6rem] xl:text-[0.8rem] w-[6rem] md:w-[7rem] xl:w-[10rem]">Change Profile</button>
        </div>
    )
}