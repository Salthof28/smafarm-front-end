import { fetchUpdateUserByAdmin } from "@/services/api";
import { UpdateUser, UserOut } from "@/types/interfaces";
import { Button, Descriptions, Form, ConfigProvider, theme, Select, message } from "antd";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

interface FormFarmAdminProp {
  hiddenForm: () => void,
  fetchUsers: () => void
  currentUser: UserOut
}

export default function FormUserAdmin({ hiddenForm, currentUser, fetchUsers }: FormFarmAdminProp) {
    const [form] = Form.useForm();
    const {data: session} = useSession()
    const { Option } = Select;
    const [messageApi, contextHolder] = message.useMessage();
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    


  const onFinish = async (values: UpdateUser) => {
    try {
        const token = session?.accessToken
        if (!token) {
            message.error("Unauthorized. Please login again.");
            return;
        }
        setLoadingSubmit(true);
        const updatedStatus = await fetchUpdateUserByAdmin(currentUser.id, values, token);
        if ("data" in updatedStatus) {
            messageApi.open({
                type: 'success',
                content: 'Status farm updated successfully!',
            });
            setLoadingSubmit(false);
            hiddenForm();
            fetchUsers();
        } else {
            messageApi.open({
                type: 'error',
                content: updatedStatus.message,
            });
        }
    } catch (error) {
        console.error(error);
        messageApi.open({
            type: 'error',
            content: 'An error occurred while updating status farm.',
        });
    }
  };

  return (
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
      <div className="w-[95vw] 2xl:w-[75vw] bg-[#180c05] rounded-[1rem] p-[2rem] text-[rgb(240,230,226)] overflow-x-auto">
        {contextHolder}
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="w-full bg-[#180c05]"
            initialValues={{
                status: currentUser.status,
            }}
        >
          <Button onClick={hiddenForm} type="text" icon={<ArrowLeft />} />
          <h4 className="text-center mb-[1rem]">Farms</h4>
            <div className="flex flex-row gap-[1rem] md:gap-[4rem] w-full items-center justify-center">
                <Form.Item
                label="Status Farm"
                name="status"
                rules={[{ required: true, message: "Please pick a start date" }]}
                >
                    <Select placeholder="Change Status Farm">
                        <Option value="ACTIVE">ACTIVE</Option>
                        <Option value="BANNED">BANNED</Option>
                    </Select>
                </Form.Item>
                <Button color="cyan" variant="solid" htmlType="submit" loading={loadingSubmit}>
                Change
                </Button>
            </div>

            <div className="flex flex-col justify-center items-center mb-[1rem]">
                <img src={currentUser.img_profile} className="w-[8rem] h-[8rem] object-cover rounded-[50%] border-2" />
                <Descriptions
                title="User Detail"
                bordered
                column={1}
                className="w-full md:w-3/5 mx-auto mb-8"
                >
                    <Descriptions.Item label="Name:">{currentUser.name}</Descriptions.Item>
                    <Descriptions.Item label="Email:">{currentUser.email}</Descriptions.Item>
                    <Descriptions.Item label="Phone:">{currentUser.phone}</Descriptions.Item>
                    <Descriptions.Item label="Role:">{currentUser.role}</Descriptions.Item>
                    <Descriptions.Item label="Status User:">{currentUser.status}</Descriptions.Item>
                </Descriptions>
            </div>


        </Form>
      </div>
    </ConfigProvider>
  );
}
