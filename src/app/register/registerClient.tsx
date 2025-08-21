'use client'
import Navbar from "@/components/navbar";
import Link from "next/link";
import { Form, Input, Button, Typography, Alert, Select } from "antd";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { InptRegister } from "@/types/interfaces";
import { fetchRegisterUser } from "@/services/api";
import { RuleObject } from "antd/es/form";

export default function RegisterClient () {
    const { data: session, status } = useSession();
    const { Title } = Typography;
    const { Option } = Select;
    const activeIconNav: string = 'login'; 
    const router = useRouter();
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const passwordRules = [
        { required: true, message: 'Please input your password!' },
        {
            validator: (_: RuleObject, value: string) =>
            value && value.trim() !== '' ? Promise.resolve() : Promise.reject(new Error('Password cannot be empty or just spaces')),
        },
    ];

    useEffect(() => { 
        if (status === "unauthenticated") {
          router.push("/register");
        } else if (session?.user?.role === "CUSTOMER") {
          router.replace("/dashboard");
        } else if (session?.user?.role === "BREEDER") {
          router.replace("/dashboard");
        } else if (session?.user?.role === "ADMIN") {
          router.replace("/dashboard");
        }
    }, [status, session, router]);
    
    const onFinish = async (values: InptRegister) => {
        setLoading(true);
        setErrorMsg(null);
        const register = await fetchRegisterUser(values);
        if ('statusCode' in register && register.statusCode !== 200) {
            // misal email atau phone sudah ada
            setErrorMsg(register.message); 
            setLoading(false);
            return;
        };
        router.push('/login');
        setLoading(false);
    }

    return(
        <div className="bg-amber-100 w-full flex flex-col items-center min-h-screen overflow-x-hidden">
            <Navbar activeIconNav={activeIconNav}/>
            <main className="flex items-center flex-col justify-center min-h-[100vh]">
            <div className="p-8 shadow-lg rounded-lg bg-white w-[24rem]">
                <Link href="/login" className="text-blue-500 mb-4 inline-block">← Back to Login</Link>
                <Title level={2} className="text-center mb-6">Register</Title>
                {errorMsg && <Alert type="error" message={errorMsg} className="mb-4" />}
                <Form layout="vertical" onFinish={onFinish}>
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input your name!' }]}
                >
                    <Input placeholder="Name" />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                    { required: true, message: 'Please input your email!' },
                    { type: 'email', message: 'Invalid email format' }
                    ]}
                >
                    <Input placeholder="email@mail.com" />
                </Form.Item>
                <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[
                        { required: true, message: 'Please input your phone number!' },
                        { pattern: /^[0-9]{10,15}$/, message: 'Phone must be 10-15 digits' }
                    ]}
                >
                    <Input placeholder="08xxxxx" />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={passwordRules}
                >
                    <Input.Password placeholder="Password" />
                </Form.Item>
                <Form.Item
                    label="Role"
                    name="role"
                    rules={[{ required: true, message: "Please select at least one role!" }]}
                >
                <Select placeholder="Select a role">
                    <Option value="CUSTOMER">Customer</Option>
                    <Option value="BREEDER">Breeder</Option>
                </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading}>
                    Register
                    </Button>
                </Form.Item>
                </Form>
            </div>
            </main>
        </div>
    )
}