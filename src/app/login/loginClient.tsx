'use client'
import Navbar from "@/components/navbar";
import useAuth from "@/hooks/useAuth";
import { signIn } from "next-auth/react";
// import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Form, Input, Button, Typography, Alert } from "antd";

interface InptLogin {
    email: string,
    password: string
}
interface LoginClientProps {
    initialLoading: boolean
}
export default function LoginClient({ initialLoading }: LoginClientProps) {
    const activeIconNav: string = 'login'; 
    const { router } = useAuth();
    const { Title } = Typography;
    const [form] = Form.useForm();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || ('/dashboard');
    const errorType = searchParams.get('error');
    const emptyFields = { email: '', password: '' };
    
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(initialLoading);

    useEffect(() => {
        if(errorType){
            switch (errorType) {
                case "CredentialsSignin":
                    setError("Invalid email or password");
                    break;
                case "SessionRequired":
                    setError("You need to be signed in to access this page");
                    break;
                default:
                    setError("An authentication error occurred");
            }
        }
    }, [errorType])
     
    const onFinish = async (values: InptLogin) => {
        setLoading(true);
        setError(null);
        const user = await signIn('credentials', {
            email: values.email,
            password: values.password,
            redirect: false
        });

        if(user?.error){
            setError(!values.email || !values.password ? 'Please fill all fields' : 'Invalid email or password');
            form.setFieldsValue(emptyFields);
        } 
        else {
            router.push(redirect);
            router.refresh();
        }
        setLoading(false);
    };

    return(
        <div className="bg-amber-100 w-full flex flex-col items-center min-h-screen overflow-x-hidden">
            <Navbar activeIconNav={activeIconNav}/>
            <main className="flex items-center flex-col justify-center min-h-[100vh]">
                <img src='/smafarm-logo.png' alt="smafarm-logo" />
                <div className="p-8 shadow-lg rounded-lg bg-white md:w-[24rem]">
                    <Title level={2} className="text-center mb-6">Login</Title>
                    {error && <Alert type="error" message={error} className="mb-4" />}
                    <Form form={form} layout="vertical" onFinish={onFinish}>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Please input your email!' }]}
                        >
                            <Input placeholder="email@mail.com" />
                        </Form.Item>
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password placeholder="Password" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block loading={loading}>
                            Sign In
                            </Button>
                        </Form.Item>
                        <Form.Item>
                            <Button type="default" block onClick={() => router.push("/register")}>
                            Create Account
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </main>
        </div>
    )
}