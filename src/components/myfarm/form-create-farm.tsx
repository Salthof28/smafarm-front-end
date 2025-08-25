'use client'
import { Button, Form, Input, message, Spin } from "antd";
import { useSession } from "next-auth/react";
import { fetchCreatefarm } from "@/services/api"; // pastikan path ini sesuai
import { useState } from "react";

export interface FormCreateFarm {
    name: string,
    location: string
}

interface FormEditProfileProp {
    hiddenForm: () => void;
    // session: Session | null;
}
// {hiddenForm, session}: FormEditProfileProp
export default function CreatedFarm({hiddenForm}: FormEditProfileProp) {
    const [form] = Form.useForm();
    const { data: session, update } = useSession();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: FormCreateFarm) => {
        const token = session?.accessToken;
        if (!token) {
            message.error("Token not found. Please login again.");
            return;
        }
        const data: FormCreateFarm = {
            name: values.name,
            location: values.location,
        };
        setLoading(true);
        try {
            const res = await fetchCreatefarm(data, token);
            if (res?.error) {
                message.error(res?.message || "Failed to create farm");
                return;
            }

            const profileRes = await fetch("http://localhost:4000/users/profile", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const profileJson = await profileRes.json();
            await update({
            trigger: "update",
            user: {
                ...session.user,
                profile: {
                ...session.user.profile,
                hasFarm: profileJson.data.farms !== null
                }
            }
            });
            console.log(session.user.profile);
            message.success("Farm created successfully!");
            hiddenForm();
        } catch (error) {
            console.log(error)
            message.error("Network error, please try again.");
        } finally {
            setLoading(false);
        }
    };

    return(
        <div className="w-[95vw] 2xl:w-[75vw] bg-amber-50 rounded-[1rem] p-[2rem]">
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="w-full bg-amber-50"
            >
                <h4 className="text-center font-bold mb-4">Create Your Farm</h4>

                <Form.Item
                    label="Name Farm"
                    name="name"
                    rules={[{required: true , message: "Please enter name farm" }]}
                >
                    <Input placeholder="john"  />
                </Form.Item>

                <Form.Item
                    label="Location"
                    name="location"
                    rules={[{required: true , message: "Please enter your farm location" }]}
                >
                    <Input placeholder="Jl.xxxxx"  />
                </Form.Item>

                <Form.Item className="flex justify-end">
                    <Button 
                        color="cyan" 
                        variant="solid" 
                        htmlType="submit"
                        disabled={loading}
                    >
                        {loading ? <Spin size="small" /> : "Create"}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
