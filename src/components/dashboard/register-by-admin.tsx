'use client'
import { Form, Input, Button, Typography, Alert, Select, message, ConfigProvider, theme } from "antd";
import { useState } from "react";
import { InptRegister } from "@/types/interfaces";
import { fetchRegisterUser } from "@/services/api";
import { RuleObject } from "antd/es/form";
import { ArrowLeft } from "lucide-react";

interface RegisterByAdminProp {
    hiddenForm: () => void
}
export default function RegisterByAdmin ({ hiddenForm }: RegisterByAdminProp) {
    const { Title } = Typography;
    const { Option } = Select;
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);
    const passwordRules = [
        { required: true, message: 'Please input your password!' },
        {
            validator: (_: RuleObject, value: string) =>
            value && value.trim() !== '' ? Promise.resolve() : Promise.reject(new Error('Password cannot be empty or just spaces')),
        },
    ];

    const onFinish = async (values: InptRegister) => {
        setLoading(true);
        setErrorMsg(null);
        const register = await fetchRegisterUser(values);
        if ('statusCode' in register && register.statusCode !== 200) {
            // misal email atau phone sudah ada
            messageApi.open({
                type: 'error',
                content: register.message,
            });
            setErrorMsg(register.message); 
            setLoading(false);
            return;
        };
        messageApi.open({
            type: 'success',
            content: register.message,
        });
        setLoading(false);
        hiddenForm()
    }

    return(
        <ConfigProvider
        theme={{
            algorithm: theme.darkAlgorithm, // kalau mau dark mode
            components: {
            Descriptions: {
                contentColor: "rgb(240,230,226)",
                labelColor: "rgb(240,230,226)",
                titleColor: "rgb(240,230,226)",
                labelBg: "#180c05",
                extraColor: "rgb(240,230,226)",
            },
            },
        }}
        >
        <div className="w-[90vw] 2xl:w-[25vw] bg-[#180c05] rounded-[1rem] p-[2rem] text-[rgb(240,230,226)] overflow-x-auto">
            {contextHolder}
            <Button onClick={hiddenForm} type="text" icon={<ArrowLeft />} />
            <Title level={3} className="text-center mb-6">Register By Admin</Title>
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
                <Option value="ADMIN">ADMIN</Option>
            </Select>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading}>
                Register
                </Button>
            </Form.Item>
            </Form>
        </div>
        </ConfigProvider>
    )
}