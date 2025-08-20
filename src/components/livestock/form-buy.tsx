'use client'
import { useCart } from "@/app/context/Cart-context";
import { fetchSheltersFarm } from "@/services/api";
import { Animal, CustomApiError, Farm, FarmDetailResponse, Livestock, Shelter } from "@/types/interfaces";
import { Form, Input, Select, Button, DatePicker, Checkbox, InputNumber } from "antd";
import { ArrowLeft, CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";


interface FormBuyAnimalProp {
    animal: Livestock;
    hiddenForm: () => void;
}
interface Treatment {
    name: string,
    price: number,
}
interface FormAnimal {
    wantCare: string,
    moreTreatment: string,
    rent: string,
    address: string
}
export default function FormBuyAnimal({ animal, hiddenForm }: FormBuyAnimalProp) {
    const [hidden, setHidden] = useState<boolean>(true);
    const [shelters, setShelters] = useState<Shelter[]>([]);
    const [form] = Form.useForm();
    const { Option } = Select;
    const { setTransaction, addBuyItem, addCareItem } = useCart();

    // const requiredTreatment = [
    //     { name: "Feeder", price: 18000 },
    //     { name: "Care", price: 15000 },
    // ];

    // const optionalTreatment = { name: "Nutrition", price: 90000 };

    const wantCare = Form.useWatch("wantCare", form);
    const selectedShelterId = Form.useWatch("shelterId", form);
    const selectedShelter = shelters.find(s => s.id === selectedShelterId);

    const fetchAllShelters = async (id: number) => {
        const farmsJson: FarmDetailResponse | CustomApiError = await fetchSheltersFarm(id);
        if ("data" in farmsJson) {
            const allShelters = farmsJson.data;
            setShelters(allShelters.shelters)
        } else {
            console.error("Error fetching shelters:", farmsJson.message);
        }

    }
    useEffect(() => {
        setHidden(wantCare !== "yes");
    }, [wantCare]);

    useEffect(() => {
    if (!hidden && shelters.length < 1) {
        console.log(animal.farm_id);
        fetchAllShelters(animal.farm_id);
    }
    }, [hidden]);

    const onFinish = (values: any) => {
        // 1. pastikan transaksi ada farm id
        setTransaction({ id_farm: animal.farm_id });

        // 2. simpan pembelian hewan
        addBuyItem({
            livestock_id: animal.id,
            price: animal.price, 
            total_livestock: values.totalLivestock,
        });

        // 3. kalau ada care
        if (values.wantCare === "yes") {
            const careGiveIds = selectedShelter?.care_give
            ?.filter((_, index) => values.treatments?.[index]?.selected)
            ?.map(t => t.id) || [];
            
            const selectedCareGives = selectedShelter?.care_give?.filter(cg => 
                values.careGiveIds.includes(cg.id)
            ) || [];
            const priceDaily = selectedCareGives.reduce((sum, cg) => sum + cg.price, 0);

            const start = values.start;   // DatePicker value
            const finish = values.finish; // DatePicker value
            const totalDays = finish.diff(start, "day"); 

            addCareItem({
            livestock_id: animal.id,
            shelter_id: values.shelterId,
            total_livestock: values.totalLivestock,
            start_date: values.start.format("YYYY-MM-DD"),
            finish_date: values.finish.format("YYYY-MM-DD"),
            price_daily: priceDaily, // bisa diubah sum semua
            careGive_id: careGiveIds,
            total_days: values.finish.diff(values.start, "day"),
            });
        }

        hiddenForm(); // close form
    };

    return (
        <div className="w-[95vw] 2xl:w-[75vw] bg-amber-50 rounded-[1rem] p-[2rem]">
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="w-full bg-amber-50"
            >
                <Button onClick={hiddenForm} type="text" icon={<ArrowLeft />} />
                <h4 className="text-center font-bold mb-4">Buy {animal?.name}</h4>

                <Form.Item
                    label="Do you want care animal?"
                    name="wantCare"
                    rules={[{ required: true, message: "Please select an option" }]}
                >
                    <Select placeholder="Select yes or no">
                    <Select.Option value="yes">Yes</Select.Option>
                    <Select.Option value="no">No</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Total Livestock"
                    name="totalLivestock"
                    rules={[{ required: true, message: "Please input total livestock" }]}
                >
                    <InputNumber defaultValue={1} min={1} max={animal.stock}  />
                </Form.Item>
                <div className={`${hidden === true ? 'hidden' : 'flex'} flex-col my-[0.5rem] bg-amber-100 p-[1rem] rounded-[1rem]`}>
                        <Form.Item
                            label="Select Shelter"
                            name="shelterId"
                            rules={[{ required: true, message: "Please pick a date" }]}
                        >
                            <Select placeholder="Select a role">
                            {shelters?.map((shelter) => (
                                <Option key={shelter.id} value={shelter.id}>
                                {shelter.name}
                                </Option>
                            ))}
                            </Select>
                        </Form.Item>
                    <Form.List name="treatments">
                        {(fields, { add }) => (
                        <>
                            <h5 className="mb-[1.5rem]">Care Service:</h5>
                            {selectedShelter?.care_give?.map((treatment, index) => (
                                <Form.Item
                                key={treatment.id ?? index}
                                name={[index, "selected"]}
                                valuePropName="checked"
                                >
                                    
                                <Checkbox disabled={treatment.required} defaultChecked={treatment.required}>
                                    {treatment.name} - Rp {treatment.price}
                                </Checkbox>
                                </Form.Item>
                            ))}
                        </>
                        )}
                    </Form.List>
                    <div className="flex flex-row gap-[1rem] md:gap-[4rem]">
                        <Form.Item
                            label="Start Care"
                            name="start"
                            rules={[{ required: true, message: "Please pick a date" }]}
                        >
                            <DatePicker />
                        </Form.Item>
                        <Form.Item
                            label="Finish Care"
                            name="finish"
                            rules={[{ required: true, message: "Please pick a date" }]}
                        >
                            <DatePicker />
                        </Form.Item>
                    </div>
                </div>

                <Form.Item
                    label="Address Delivery"
                    name="address"
                    rules={[{ required: true, message: "Please input your address" }]}
                >
                    <Input.TextArea placeholder="Enter your full address" rows={3} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Buy</Button>
                </Form.Item>
            </Form>
        </div>
    );
}