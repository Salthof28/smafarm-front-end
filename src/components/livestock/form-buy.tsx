'use client'
import { useCart } from "@/app/context/Cart-context";
import { fetchSheltersFarm } from "@/services/api";
import { CustomApiError, FarmDetailResponse, Livestock, Shelter } from "@/types/interfaces";
import { Form, Input, Select, Button, DatePicker, Checkbox, InputNumber } from "antd";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

interface FormBuyAnimalProp {
  animal: Livestock;
  hiddenForm: () => void;
}
interface TreatmentValue {
  id: number;
  selected: boolean;
}

interface FormValues {
  totalLivestock: number;
  wantCare: "yes" | "no";
  shelterId: number;
  start: dayjs.Dayjs;
  finish: dayjs.Dayjs;
  treatments: TreatmentValue[];
}
export default function FormBuyAnimal({ animal, hiddenForm }: FormBuyAnimalProp) {
    const [hidden, setHidden] = useState<boolean>(true);
    const [shelters, setShelters] = useState<Shelter[]>([]);
    const [form] = Form.useForm();
    const { Option } = Select;
    const { setTransaction, addBuyItem, addCareItem } = useCart();

    const wantCare = Form.useWatch("wantCare", form);
    const selectedShelterId = Form.useWatch("shelterId", form);
    const selectedShelter = shelters.find((s) => s.id === selectedShelterId);

    /** Fetch shelters for farm */
    const fetchAllShelters = async (id: number) => {
        const farmsJson: FarmDetailResponse | CustomApiError = await fetchSheltersFarm(id);
        if ("data" in farmsJson) {
        setShelters(farmsJson.data.shelters);
        } else {
        console.error("Error fetching shelters:", farmsJson.message);
        }
    };

    /** Toggle hidden when wantCare change */
    useEffect(() => {
        setHidden(wantCare !== "yes");
    }, [wantCare]);

    /** Fetch shelters one time */
    useEffect(() => {
        if (!hidden && shelters.length < 1) {
        fetchAllShelters(animal.farm_id);
        }
    }, [hidden]);

  /** Update form treatment when shelter selected */
    useEffect(() => {
        form.setFieldsValue({ totalLivestock: 1 })
        if (selectedShelter) {
            const initTreatments = selectedShelter.care_give.map((cg) => ({
                id: cg.id,
                selected: cg.required, // auto true for required
            }));
            form.setFieldsValue({ treatments: initTreatments });
        }
    }, [selectedShelter, form]);

    const onFinish = (values: FormValues) => {
        // Set transaksi farm id
        setTransaction({ id_farm: animal.farm_id });

        // Simpan pembelian
        addBuyItem({
        livestock_id: animal.id,
        price: animal.price,
        total_livestock: values.totalLivestock,
        });

        // Kalau user pilih care
        if (values.wantCare === "yes" && selectedShelter) {
            const careGiveIds = values.treatments
                ?.filter((t: any) => t.selected)
                ?.map((t: any) => t.id) || [];

            const priceDaily = selectedShelter.care_give
                .filter((cg) => careGiveIds.includes(cg.id))
                .reduce((sum, cg) => sum + cg.price, 0);

            const start = values.start!;
            const finish = values.finish!;
            const totalDays = finish.diff(start, "day");

            addCareItem({
                livestock_id: animal.id,
                shelter_id: values.shelterId!,
                total_livestock: values.totalLivestock,
                start_date: start.format("YYYY-MM-DD"),
                finish_date: finish.format("YYYY-MM-DD"),
                price_daily: priceDaily,
                careGive_id: careGiveIds,
                total_days: totalDays,
            });
        }

        hiddenForm();
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
                    <Option value="yes">Yes</Option>
                    <Option value="no">No</Option>
                </Select>
                </Form.Item>

                <Form.Item
                label="Total Livestock"
                name="totalLivestock"
                rules={[{ required: true, message: "Please input total livestock" }]}
                >
                <InputNumber defaultValue={1} min={1} max={animal.stock} />
                </Form.Item>

                {/* Form Care */}
                {!hidden && (
                <div className="flex flex-col my-[0.5rem] bg-amber-100 p-[1rem] rounded-[1rem]">
                    <Form.Item
                    label="Select Shelter"
                    name="shelterId"
                    rules={wantCare === "yes"
                        ? [{ required: true, message: "Please select shelter" }]
                        : []}
                    >
                        <Select placeholder="Select a shelter">
                            {shelters?.map((shelter) => (
                            <Option key={shelter.id} value={shelter.id}>
                                {shelter.name}
                            </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/* Checkbox untuk Treatments */}
                    {selectedShelter?.care_give?.map((treatment, index) => (
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
                        rules={wantCare === "yes"
                        ? [{ required: true, message: "Please pick a start date" }]
                        : []}
                    >
                        <DatePicker />
                    </Form.Item>
                    <Form.Item
                        label="Finish Care"
                        name="finish"
                        rules={wantCare === "yes"
                        ? [{ required: true, message: "Please pick a finish date" }]
                        : []}
                    >
                        <DatePicker />
                    </Form.Item>
                    </div>
                </div>
                )}

                <Form.Item
                label="Address Delivery"
                name="address"
                rules={[{ required: true, message: "Please input your address" }]}
                >
                <Input.TextArea placeholder="Enter your full address" rows={3} />
                </Form.Item>

                <Form.Item>
                <Button type="primary" htmlType="submit">
                    Buy
                </Button>
                </Form.Item>
            </Form>
        </div>
    );
}
