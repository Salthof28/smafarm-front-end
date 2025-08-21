'use client'

import { useCart } from "@/app/context/Cart-context";
import { Shelter } from "@/types/interfaces";
import { Form, Input, Button, DatePicker, Checkbox, InputNumber } from "antd";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

interface FormValues {
  totalLivestock: number;
  shelterId: number;
  start: dayjs.Dayjs;
  finish: dayjs.Dayjs;
  treatments: TreatmentValue[];
}
interface TreatmentValue {
  id: number;
  selected: boolean;
}
interface FormCareAnimalProp {
    shelter: Shelter;
    hiddenForm: () => void;
}
export default function FormRentShelter ({ shelter, hiddenForm }: FormCareAnimalProp) {
    // const [shelters, setShelters] = useState<Shelter[]>([]);
    const [form] = Form.useForm();
    const { setTransaction, addCareItem } = useCart();
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [careGiveIds, setCareGiveIds] = useState<number[]>([]);
    const [priceDaily, setPriceDaily] = useState<number>(0);
    const [livestock, setLivestock] = useState<number>(0);
    const [totalDays, setTotalDays] = useState<number>(0);

    const calculateTotal = () => {
        const values = form.getFieldsValue();
        const currentCareGiveIds = values.treatments
            ?.filter((t: TreatmentValue) => t.selected)
            ?.map((t: TreatmentValue) => t.id) || [];
        const currentPriceDaily = shelter.care_give
            .filter((cg) => currentCareGiveIds.includes(cg.id))
            .reduce((sum, cg) => sum + cg.price, 0);
        const currentStart = values.start;
        const currentFinish = values.finish;
        const currentLivestock = values.totalLivestock || 1;
        const basePrice = shelter.price_daily;
        const totalDay = currentStart && currentFinish
            ? currentFinish.diff(currentStart, "day")
            : 0;
        const total = (currentPriceDaily + basePrice) * currentLivestock * totalDay;
        setCareGiveIds(currentCareGiveIds);
        setPriceDaily(currentPriceDaily);
        setTotalDays(totalDay);
        setLivestock(currentLivestock);
        setTotalPrice(total);
    };
  /** Update form treatment when shelter selected */
    useEffect(() => {
        form.setFieldsValue({ totalLivestock: 1 })
        const initTreatments = shelter.care_give.map((cg) => ({
            id: cg.id,
            selected: cg.required, // auto true for required
        }));
        form.setFieldsValue({ treatments: initTreatments });
        // setTimeout(() => { calculateTotal(); }, 0);
    }, [form]);




    const onFinish = (values: FormValues) => {
        // Set transaksi farm id
        setTransaction({ id_farm: shelter.farm_id });
        // const careGiveIds: number[] = values.treatments
        //     ?.filter((t: any) => t.selected)
        //     ?.map((t: any) => t.id) || [];
        // const priceDaily = shelter.care_give
        //     .filter((cg) => careGiveIds.includes(cg.id))
        //     .reduce((sum, cg) => sum + cg.price, 0);
        const start = values.start;
        const finish = values.finish;
        // const totalDays = finish.diff(start, "day");
        addCareItem({
            shelter_id: values.shelterId,
            total_livestock: livestock,
            start_date: start.format("YYYY-MM-DD"),
            finish_date: finish.format("YYYY-MM-DD"),
            price_daily: priceDaily + shelter.price_daily,
            careGive_id: careGiveIds,
            total_days: totalDays,
        });

        hiddenForm();
    };

    return (
        <div className="w-[95vw] 2xl:w-[75vw] bg-amber-50 rounded-[1rem] p-[2rem]">
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="w-full bg-amber-50"
                onValuesChange={calculateTotal}
            >
                <Button onClick={hiddenForm} type="text" icon={<ArrowLeft />} />
                <h4 className="text-center font-bold mb-4">Rent {shelter?.name} {shelter?.farm?.name}</h4>

                <Form.Item
                label="Total Livestock"
                name="totalLivestock"
                rules={[{ required: true, message: "Please input total livestock" }]}
                >
                <InputNumber defaultValue={1} min={1} />
                </Form.Item>
                    {/* Checkbox untuk Treatments */}
                    {shelter?.care_give?.map((treatment, index) => (
                    <div key={treatment.id}>
                        <Form.Item name={['treatments', index, 'id']} hidden>
                            <Input type="hidden" />
                        </Form.Item>
                        <Form.Item
                        name={['treatments', index, 'selected']}
                        valuePropName="checked"
                        >
                            <Checkbox disabled={treatment.required}>
                                {treatment.name} - Rp {treatment.price}
                            </Checkbox>
                        </Form.Item>
                    </div>
                    ))}
                    <div className="flex flex-row gap-[1rem] md:gap-[4rem]">
                        <Form.Item
                            label="Start Care"
                            name="start"
                            rules={[{ required: true, message: "Please pick a start date" }]}
                        >
                            <DatePicker />
                        </Form.Item>
                        <Form.Item
                            label="Finish Care"
                            name="finish"
                            rules={[{ required: true, message: "Please pick a finish date" }]}
                        >
                            <DatePicker />
                        </Form.Item>
                    </div>

                <Form.Item
                label="Address Delivery"
                name="address"
                rules={[{ required: true, message: "Please input your address" }]}
                >
                    <Input.TextArea placeholder="Enter your full address" rows={3} />
                </Form.Item>
                <Form.Item>
                    <h5>Rp {totalPrice}</h5>
                </Form.Item>
                <Form.Item>
                    <Button color="cyan" variant="solid" htmlType="submit">
                        Care
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}
