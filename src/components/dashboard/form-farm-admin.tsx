import { fetchUpdateStatFarmAdmin } from "@/services/api";
import { Farm, UpdateStatusFarm } from "@/types/interfaces";
import { Button, Descriptions, Form, Input, ConfigProvider, theme, Table, Select, message } from "antd";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

interface FormFarmAdminProp {
  hiddenForm: () => void,
  fetchFarms: () => void
  currentFarm: Farm
}

export default function FormFarmAdmin({ hiddenForm, currentFarm, fetchFarms }: FormFarmAdminProp) {
    const [form] = Form.useForm();
    const {data: session} = useSession()
    const { Option } = Select;
    const [messageApi, contextHolder] = message.useMessage();
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    

    const columnsShelters = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <span className="font-medium">{text}</span>,
        },
        {
            title: 'Accomodate',
            dataIndex: 'accomodate',
            key: 'accomodate',
            render: (accomodate: number) => (
            <span className="font-bold">
                {accomodate}
            </span>
            ),
        },
        {
            title: 'Price Daily',
            dataIndex: 'price_daily',
            key: 'price_daily',
            render: (price_daily: number) => <span className="font-bold">{price_daily}</span>,
        },
    ];

    const columnsLivestocks = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <span className="font-medium">{text}</span>,
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            key: 'stock',
            render: (stock: number) => (
            <span className="font-bold">
                {stock}
            </span>
            ),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => <span className="font-bold">{price}</span>,
        },
    ];

  const onFinish = async (values: UpdateStatusFarm) => {
    try {
        const token = session?.accessToken
        if (!token) {
            message.error("Unauthorized. Please login again.");
            return;
        }
        setLoadingSubmit(true);
        const updatedStatus = await fetchUpdateStatFarmAdmin(currentFarm.id, values, token);
        if ("data" in updatedStatus) {
            messageApi.open({
                type: 'success',
                content: 'Status farm updated successfully!',
            });
            setLoadingSubmit(false);
            hiddenForm();
            fetchFarms();
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
                status_farm: currentFarm.status_farm,
            }}
        >
          <Button onClick={hiddenForm} type="text" icon={<ArrowLeft />} />
          <h4 className="text-center mb-[1rem]">Farms</h4>
            <div className="flex flex-row gap-[1rem] md:gap-[4rem] w-full items-center justify-center">
                <Form.Item
                label="Status Farm"
                name="status_farm"
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

            <div className="flex justify-center items-center mb-[1rem]">
                <Descriptions
                title="Care Transaction Detail"
                bordered
                column={1}
                className="w-full md:w-3/5 mx-auto mb-8"
                >
                    <Descriptions.Item label="Name:">{currentFarm.name}</Descriptions.Item>
                    <Descriptions.Item label="Location:">{currentFarm.location}</Descriptions.Item>
                    <Descriptions.Item label="Rating:">{currentFarm.rating}</Descriptions.Item>
                    <Descriptions.Item label="Status Farm:">{currentFarm.status_farm}</Descriptions.Item>
                </Descriptions>
            </div>


        </Form>
        <div className="flex flex-col md:flex-row mt-[1rem] justify-center gap-[1rem] items-center">
            {currentFarm.shelters.length > 0 && (
            <div>
                <h6 className="font-bold">Shelters have:</h6>
                <Table
                    columns={columnsShelters}
                    dataSource={currentFarm.shelters}
                    rowKey="id"
                    bordered
                    pagination={false} 
                    className="shadow-md mt-[0.5rem]"
                />
            </div>
            )}
            {currentFarm.livestock.length > 0 && (
            <div>
                <h6 className="font-bold">Livestocks have:</h6>
                <Table
                    columns={columnsLivestocks}
                    dataSource={currentFarm.livestock}
                    rowKey="id"
                    bordered
                    pagination={false} 
                    className="shadow-md mt-[0.5rem]"
                />
            </div>
            )}

        </div>
      </div>
    </ConfigProvider>
  );
}
