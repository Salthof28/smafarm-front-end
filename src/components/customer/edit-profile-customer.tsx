'use client'
import { fetchEditProfile } from "@/services/api";
import { FormValues } from "@/types/interfaces";
import { Button, Form, Input, message } from "antd";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

interface FormEditProfileProp {
    hiddenForm: () => void;
}
export default function EditProfile({hiddenForm}: FormEditProfileProp) {
    const [form] = Form.useForm();
    const { data: session, update } = useSession();

    const onFinish = async (values: FormValues) => {
        const token = session?.accessToken;
        if (!token) {
            message.error("Token not found. Please login again.");
            return;
        }
        try {
            const res = await fetchEditProfile(values, token);
            if (res?.error) {
                message.error(res?.message || "Failed to update profile");
                return;
            }
            console.log(session.user.profile)
            message.success("Profile updated successfully!");
            await update({
                trigger: "update",
                user: {
                    ...session.user,
                    profile: {
                    ...session.user.profile,
                    ...values,
                    }
                }
            });
            console.log(session.user.profile)
            hiddenForm(); // Menutup form setelah sukses
        } catch (error) {
            console.log(error)
            message.error(`Network error, please try again`);
        }
    };
    return(
        <div className="w-[95vw] 2xl:w-[75vw] bg-amber-50 rounded-[1rem] p-[2rem]">
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="w-full bg-amber-50"
                // onValuesChange={calculateTotal}
            >
                
                <Button  type="text" icon={<ArrowLeft />} onClick={hiddenForm} />
                <h4 className="text-center font-bold mb-4">Edit Profile</h4>
                <Form.Item
                label="Name"
                name="name"
                >
                    <Input placeholder="john"  />
                </Form.Item>
                <Form.Item
                label="Email"
                name="email"
                rules={[{ message: "Please enter a valid email address" }]}
                >
                    <Input placeholder="example@mail.com"  />
                </Form.Item>
                <Form.Item
                label="Phone"
                name="phone"
                rules={[{ message: "Please enter a valid email address" }]}
                >
                    <Input placeholder="08xxxxxxx"  />
                </Form.Item>
                <Form.Item
                label="Old Password"
                name="oldPassword"
                >
                    <Input.Password placeholder="Enter old password" />
                </Form.Item>
                <Form.Item
                label="Password"
                name="password"
                >
                    <Input.Password placeholder="Enter new password" />
                </Form.Item>
                <div className="flex justify-end gap-[1rem]">
                    <Form.Item>
                        <Button onClick={hiddenForm} color="danger" variant="solid"  htmlType="button">
                            Cancel
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button color="cyan" variant="solid" htmlType="submit">
                            Change Profile
                        </Button>
                    </Form.Item>
                </div>
            </Form>
        </div>
    )
}