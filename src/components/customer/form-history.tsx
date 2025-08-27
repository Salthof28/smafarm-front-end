'use client'
import { fetchAllCareTransaction, fetchDetailShelter, fetchReshedule } from "@/services/api";
import { CareTransaction, Shelter, UpdateCareTransaction } from "@/types/interfaces"
import { Button, DatePicker, Descriptions, Form, message } from "antd"
import dayjs from "dayjs";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrBefore);

interface FormHistoryCustomerProp {
    hiddenForm: () => void,
    care: CareTransaction
}

interface FormValues {
    totalLivestock: number;
    start: dayjs.Dayjs;
    finish: dayjs.Dayjs;
}
export default function FormHistoryCustomer({ hiddenForm, care }: FormHistoryCustomerProp) {
    const [form] = Form.useForm();
    const {data: session} = useSession()
    const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
    const [careTransactions, setCareTransactions] = useState<CareTransaction[]>([]);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [shelter, setShelter] = useState<Shelter>();
    const [totalDays, setTotalDays] = useState<number>(0);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    // const [careNow, setCareNow] = useState<CareTransaction>(care)

    useEffect(() => {
        async function fetchCare() {
            if(!care) { return }
            const bookingJson = await fetchAllCareTransaction(care?.shelter_id);
            const getShelter = await fetchDetailShelter(care?.shelter_id);
            if ('data' in bookingJson) {
                setCareTransactions(bookingJson.data)
            };
            if ('data' in getShelter) {
                setShelter(getShelter.data);
            };
        }
        fetchCare();
        // console.log(careNow);
    }, [care]);
    const maxSlots = shelter?.accomodate ?? 10;
    
    const calculateTotal = () => {
        const values = form.getFieldsValue();
        const currentStart = values.start;
        const currentFinish = values.finish;
        // const currentLivestock = values.totalLivestock;
        // const basePrice = shelter.price_daily;
        const totalDay = currentStart && currentFinish
            ? (currentFinish.diff(currentStart, "day")) + 1
            : 1;
        const total = care.one_day_price * totalDay;
        console.log(total);
        setTotalDays(totalDay);
        setTotalPrice(total);
    };
    const dateMap: Record<string, number> = {};
    careTransactions.forEach(ct => {
        const start = dayjs(ct.start_date);
        const finish = dayjs(ct.finish_date);
        let curr = start;
        while (curr.isSameOrBefore(finish, 'day')) {
            const key = curr.format('YYYY-MM-DD');
            dateMap[key] = (dateMap[key] || 0) + ct.total_livestock;
            curr = curr.add(1, 'day');
        }
    });

    const disabledDateStart = (current: dayjs.Dayjs) => {
        const today = dayjs().startOf('day');
        const dateStr = current.format('YYYY-MM-DD');
        const mapDate = dateMap[dateStr] || 0
        return current.isBefore(today, 'day') || mapDate >= maxSlots;
    };

    const disabledDateFinish = (current: dayjs.Dayjs) => {
        const start: dayjs.Dayjs = form.getFieldValue('start');
        if (!start) return true; // disable semua kalau start belum dipilih
        if (current.isBefore(start, 'day')) return true;

        let curr = start;
        while (curr.isSameOrBefore(current, 'day')) {
            const key = curr.format('YYYY-MM-DD');
            if ((dateMap[key] || 0) + (form.getFieldValue('totalLivestock') || 0) > maxSlots) return true;
            curr = curr.add(1, 'day');
        }
        return false;
    };

    const renderDateCell = (current: dayjs.Dayjs) => {
        const dateStr = current.format('YYYY-MM-DD');
        const used = dateMap[dateStr] || 0;
        const remaining = maxSlots - used;
        return (
            <div style={{ position: "relative" }}>
            <div>{current.date()}</div>
            {used > 0 && remaining > 0 && ( // showed remaining slots
                <div style={{ fontSize: 10, color: "green" }}>
                {remaining} slot
                </div>
            )}
            </div>
        );
    };

    const onFinish = async (values: FormValues) => {
        const start = values.start;
        const finish = values.finish;

        let overbooked = false;
        let curr = start;
        while (curr.isSameOrBefore(finish, 'day')) {
            const key = curr.format('YYYY-MM-DD');
            const booked = dateMap[key] || 0;
            if (booked + values.totalLivestock > maxSlots) {
                overbooked = true;
                break;
            }
            curr = curr.add(1, 'day');
        }

        if (overbooked) {
            message.error("Selected date exceeds available slots. Please adjust your selection.");
            return;
        }

        const dataUpdate: UpdateCareTransaction = {
            duration_care: totalDays,
            start_date: start.format("YYYY-MM-DD"),
            finish_date: finish.format("YYYY-MM-DD"),
            sub_total: totalPrice
        };
        const token = session?.accessToken
        if (!token) {
            message.error("Unauthorized. Please login again.");
            return;
        }

        try {
            setLoadingSubmit(true);
            const res = await fetchReshedule(care.id, dataUpdate, token);
            if (res?.success) {
                message.success("Schedule updated successfully!");
                hiddenForm();
            } else {
                message.error(res?.message || "Failed to update schedule.");
            }
        } catch (err) {
            console.error(err);
            message.error("An error occurred while updating schedule.");
        } finally {
            setLoadingSubmit(false);
            hiddenForm()
        }
        
    }

    return(
    <div className="w-[95vw] 2xl:w-[75vw] bg-amber-50 rounded-[1rem] p-[2rem]">
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="w-full bg-amber-50"
            onValuesChange={calculateTotal}
        >
            <Button onClick={hiddenForm} type="text" icon={<ArrowLeft />} />
            {/* <h4 className="text-center font-bold mb-4">Rent {shelter?.name} {shelter?.farm?.name}</h4> */}
            <h4 className="text-center mb-[1rem]">Reshedule</h4>
            <div className="flex justify-center items-center mb-[1rem]">
                <Descriptions
                    title="Care Transaction Detail"
                    bordered
                    column={1}
                    className="w-full md:w-3/5 mx-auto mb-8"
                >
                    <Descriptions.Item label="Shelter:">
                        {care.shelter?.name || '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Total Livestock:">
                        {care.total_livestock ?? 0}
                    </Descriptions.Item>
                    <Descriptions.Item label="Start Date:">
                        {dayjs(care.start_date).format("DD/MM/YYYY")}
                    </Descriptions.Item>
                    <Descriptions.Item label="Finish Date:">
                        {dayjs(care.finish_date).format("DD/MM/YYYY")}
                    </Descriptions.Item>
                    <Descriptions.Item label="Sub Total:">
                        {care.sub_total}
                    </Descriptions.Item>

                </Descriptions>
            </div>
                <div className="flex flex-row gap-[1rem] md:gap-[4rem] w-full items-center justify-center">
                    <Form.Item
                        label="Start Care"
                        name="start"
                        rules={[{ required: true, message: "Please pick a start date" }]}
                    >
                        <DatePicker disabledDate={disabledDateStart} onChange={(date) => setSelectedDate(date)} dateRender={renderDateCell} />
                    </Form.Item>
                    <Form.Item
                        label="Finish Care"
                        name="finish"
                        rules={[{ required: true, message: "Please pick a finish date" }]}
                    >
                        <DatePicker disabledDate={disabledDateFinish} dateRender={renderDateCell} />
                    </Form.Item>
                </div>
                {/* <p>Sisa slot pada start date: {remainingSlots}</p> */}
            <Form.Item>
                <h4>Total Now</h4>
                <h5>Rp {totalPrice.toLocaleString()}</h5>
            </Form.Item>
            <Form.Item className="flex justify-end">
                <Button color="cyan" variant="solid" htmlType="submit" loading={loadingSubmit}>
                    Care
                </Button>

            </Form.Item>
            {selectedDate && (
                <p className="text-center text-sm text-gray-600">
                    Selected start date: {selectedDate.format("DD/MM/YYYY")}
                </p>
            )}
        </Form>
    </div>
    )
}
